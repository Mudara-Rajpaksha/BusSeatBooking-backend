const mongoose = require('mongoose');
const { SeatMap, Trip, Booking } = require('../models/Booking');
const Route = require('../models/Route');
const Bus = require('../models/Bus');
const User = require('../models/User');
const emailService = require('../services/emailService');
const { ApiError } = require('../utils/responses');

class TripService {
  async sendEmailToUsers(bookedUsers, subject, htmlContent) {
    try {
      for (const user of bookedUsers) {
        const emailContent = {
          to: user.email,
          subject,
          html: htmlContent,
          text: `Dear ${user.firstname} ${user.lastname},\n\n${htmlContent.replace(/<[^>]+>/g, '')}`,
        };
        await emailService.sendEmail(emailContent);
      }
    } catch (error) {
      console.error('Error sending email:', error);
      throw new ApiError('Failed to send email notification', 500);
    }
  }

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

      const departureDate = new Date(tripData.departureDate);
      if (isNaN(departureDate.getTime())) {
        throw new ApiError('Invalid departure date', 400);
      }

      const arrivalDate = new Date(tripData.arrivalDate);
      if (isNaN(arrivalDate.getTime())) {
        throw new ApiError('Invalid arrival date', 400);
      }

      const intermediateStops = route.stops.map((stop) => {
        if (typeof stop.timeFromStart !== 'string') {
          throw new ApiError(`Invalid timeFromStart for stop ${stop.name}`, 400);
        }

        const timeFromStart = parseFloat(stop.timeFromStart);
        if (isNaN(timeFromStart)) {
          throw new ApiError(`Invalid timeFromStart for stop ${stop.name}`, 400);
        }

        const arrivalTime = new Date(departureDate.getTime() + timeFromStart * 60000);
        const departureTime = new Date(arrivalTime.getTime() + 5 * 60000);

        return {
          stopName: stop.name,
          arrivalTime,
          departureTime,
          fareFromStart: (route.fare / route.distance) * stop.distance,
        };
      });

      const trip = new Trip({
        routeId: tripData.routeId,
        busId: tripData.busId,
        departureDate: tripData.departureDate,
        arrivalDate: tripData.arrivalDate,
        availableSeats: seatMap.layout.filter((seat) => seat.isActive).length,
        status: 'scheduled',
        intermediateStops,
        paymentRequired: tripData.paymentRequired || false,
      });

      return await trip.save();
    } catch (error) {
      console.error('Error creating trip:', error);
      if (error.message.includes('Cast to date failed')) {
        console.error(
          'The issue might be with one of the date fields (departureDate, arrivalDate, or intermediate stops).'
        );
      }
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

      const bookings = await Booking.find({ tripId, status: 'confirmed' });
      const bookedUsers = await User.find({ _id: { $in: bookings.map((booking) => booking.userId) } });

      const cancellationSubject = `Your trip ${trip._id} has been cancelled`;
      const cancellationHtml = `
        <h2>Your trip has been cancelled</h2>
        <p>Dear ${user.firstname} ${user.lastname},</p>
        <p>We regret to inform you that your booked trip on ${trip.routeId.name} has been cancelled. Below are the details:</p>
        <p><strong>Departure:</strong> ${trip.departureDate}</p>
        <p><strong>Arrival:</strong> ${trip.arrivalDate}</p>
        <p>If you have already paid, your payment has been refunded.</p>
        <p>We apologize for the inconvenience.</p>
        <p>Best regards,<br>System Administration</p>
      `;

      await this.sendEmailToUsers(bookedUsers, cancellationSubject, cancellationHtml);

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
