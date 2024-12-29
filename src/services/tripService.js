const mongoose = require('mongoose');
const { SeatMap, Trip, Booking } = require('../models/Booking');
const Route = require('../models/Route');
const Bus = require('../models/Bus');
const { ApiError } = require('../utils/responses');

class TripService {
  async createTrip(tripData) {
    try {
      const route = await Route.findById(tripData.routeId);
      if (!route) {
        throw new ApiError('Route not found', 404);
      }

      const bus = await Bus.findById(tripData.busId);
      if (!bus || bus.status !== 'active') {
        throw new ApiError('Bus not found or inactive', 404);
      }

      const existingTrip = await Trip.findOne({
        busId: tripData.busId,
        $or: [
          {
            departureDate: {
              $lte: tripData.departureDate,
              $gte: tripData.arrivalDate,
            },
          },
          {
            arrivalDate: {
              $gte: tripData.departureDate,
              $lte: tripData.arrivalDate,
            },
          },
        ],
      });

      if (existingTrip) {
        throw new ApiError('Bus is already scheduled for this time period', 400);
      }

      const seatMap = await SeatMap.findOne({ busId: tripData.busId });
      if (!seatMap) {
        throw new ApiError('Seat map not found for this bus', 404);
      }

      const intermediateStops = route.stops.map((stop, index) => ({
        stopName: stop.name,
        arrivalTime: new Date(new Date(tripData.departureDate).getTime() + stop.timeFromStart * 60000),
        departureTime: new Date(new Date(tripData.departureDate).getTime() + (stop.timeFromStart + 5) * 60000),
        fareFromStart: (route.fare / route.distance) * stop.distance,
      }));

      const trip = new Trip({
        ...tripData,
        intermediateStops,
        availableSeats: seatMap.layout.filter((seat) => seat.isActive).length,
        status: 'scheduled',
      });

      return await trip.save();
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  }

  async updateTrip(tripId, updateData) {
    try {
      const trip = await Trip.findById(tripId);
      if (!trip) {
        throw new ApiError('Trip not found', 404);
      }

      const existingBookings = await Booking.find({ tripId, status: 'confirmed' });
      if (existingBookings.length > 0) {
        const allowedUpdates = ['status', 'arrivalDate'];
        Object.keys(updateData).forEach((key) => {
          if (!allowedUpdates.includes(key)) {
            delete updateData[key];
          }
        });
      }

      if (updateData.status === 'cancelled') {
        await Booking.updateMany({ tripId, status: 'confirmed' }, { status: 'cancelled', paymentStatus: 'refunded' });
      }

      const updatedTrip = await Trip.findByIdAndUpdate(tripId, updateData, { new: true }).populate('routeId busId');

      return updatedTrip;
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  }

  async deleteTrip(tripId) {
    try {
      const trip = await Trip.findById(tripId);
      if (!trip) {
        throw new ApiError('Trip not found', 404);
      }

      const existingBookings = await Booking.find({ tripId, status: 'confirmed' });
      if (existingBookings.length > 0) {
        throw new ApiError('Cannot delete trip with active bookings', 400);
      }

      return await Trip.findByIdAndDelete(tripId);
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  }

  async getTrip(tripId) {
    try {
      const trip = await Trip.findById(tripId).populate('routeId').populate('busId');

      if (!trip) {
        throw new ApiError('Trip not found', 404);
      }

      const bookingsCount = await Booking.countDocuments({
        tripId,
        status: 'confirmed',
      });

      return {
        ...trip.toObject(),
        bookingsCount,
      };
    } catch (error) {
      console.error('Error getting trip:', error);
      throw error;
    }
  }

  async getAllTrips(filters = {}, options = {}) {
    try {
      const query = {};

      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.routeId) {
        query.routeId = filters.routeId;
      }

      if (filters.busId) {
        query.busId = filters.busId;
      }

      if (filters.dateRange) {
        query.departureDate = {
          $gte: new Date(filters.dateRange.start),
          $lte: new Date(filters.dateRange.end),
        };
      }

      const tripsQuery = Trip.find(query).populate('routeId').populate('busId');

      if (options.sort) {
        tripsQuery.sort(options.sort);
      } else {
        tripsQuery.sort('-departureDate');
      }

      if (options.page && options.limit) {
        const page = parseInt(options.page, 10);
        const limit = parseInt(options.limit, 10);
        const skip = (page - 1) * limit;
        tripsQuery.skip(skip).limit(limit);
      }

      const [trips, total] = await Promise.all([tripsQuery.exec(), Trip.countDocuments(query)]);

      const tripsWithBookings = await Promise.all(
        trips.map(async (trip) => {
          const bookingsCount = await Booking.countDocuments({
            tripId: trip._id,
            status: 'confirmed',
          });
          return {
            ...trip.toObject(),
            bookingsCount,
          };
        })
      );

      return {
        trips: tripsWithBookings,
        total,
        page: options.page ? parseInt(options.page, 10) : 1,
        limit: options.limit ? parseInt(options.limit, 10) : total,
      };
    } catch (error) {
      console.error('Error getting all trips:', error);
      throw error;
    }
  }

  async checkTripAvailability(tripId, fromStop, toStop, seatCount) {
    try {
      const trip = await Trip.findById(tripId);
      if (!trip) {
        throw new ApiError('Trip not found', 404);
      }

      const fromStopExists = trip.intermediateStops.some((stop) => stop.stopName === fromStop);
      const toStopExists = trip.intermediateStops.some((stop) => stop.stopName === toStop);

      if (!fromStopExists || !toStopExists) {
        throw new ApiError('Invalid stops for this trip', 400);
      }

      const overlappingBookings = await Booking.find({
        tripId,
        status: 'confirmed',
        $or: [{ fromStop: { $gte: fromStop, $lt: toStop } }, { toStop: { $gt: fromStop, $lte: toStop } }],
      });

      const seatMap = await SeatMap.findOne({ busId: trip.busId });
      const totalSeats = seatMap.layout.filter((seat) => seat.isActive).length;
      const bookedSeats = overlappingBookings.reduce((acc, booking) => acc + booking.seatNumbers.length, 0);

      return {
        available: totalSeats - bookedSeats >= seatCount,
        totalSeats,
        bookedSeats,
        availableSeats: totalSeats - bookedSeats,
      };
    } catch (error) {
      console.error('Error checking trip availability:', error);
      throw error;
    }
  }
}

module.exports = new TripService();
