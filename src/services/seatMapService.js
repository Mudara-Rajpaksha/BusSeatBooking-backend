const mongoose = require('mongoose');
const { SeatMap, Trip } = require('../models/Booking');
const Bus = require('../models/Bus');
const { ApiError } = require('../utils/responses');

class SeatMapService {
  async createSeatMap(seatMapData) {
    try {
      const bus = await Bus.findById(seatMapData.busId);
      if (!bus) {
        throw new ApiError('Bus not found', 404);
      }

      const existingSeatMap = await SeatMap.findOne({ busId: seatMapData.busId });
      if (existingSeatMap) {
        throw new ApiError('Seat map already exists for this bus', 400);
      }

      this.validateSeatLayout(seatMapData.layout);

      const totalSeats = seatMapData.layout.filter((seat) => seat.isActive).length;

      const seatMap = new SeatMap({
        ...seatMapData,
        totalSeats,
      });

      return await seatMap.save();
    } catch (error) {
      console.error('Error creating seat map:', error);
      throw error;
    }
  }

  async updateSeatMap(seatMapId, updateData) {
    try {
      const seatMap = await SeatMap.findById(seatMapId);
      if (!seatMap) {
        throw new ApiError('Seat map not found', 404);
      }

      const activeTrips = await Trip.find({
        busId: seatMap.busId,
        status: { $in: ['scheduled', 'in-progress'] },
      });

      if (activeTrips.length > 0 && updateData.layout) {
        await this.validateSeatUpdateWithBookings(seatMap.busId, updateData.layout);
      }

      if (updateData.layout) {
        this.validateSeatLayout(updateData.layout);
        updateData.totalSeats = updateData.layout.filter((seat) => seat.isActive).length;
      }

      const updatedSeatMap = await SeatMap.findByIdAndUpdate(seatMapId, updateData, { new: true });

      return updatedSeatMap;
    } catch (error) {
      console.error('Error updating seat map:', error);
      throw error;
    }
  }

  async deleteSeatMap(seatMapId) {
    try {
      const seatMap = await SeatMap.findById(seatMapId);
      if (!seatMap) {
        throw new ApiError('Seat map not found', 404);
      }

      const activeTrips = await Trip.find({
        busId: seatMap.busId,
        status: { $in: ['scheduled', 'in-progress'] },
      });

      if (activeTrips.length > 0) {
        throw new ApiError('Cannot delete seat map with active trips', 400);
      }

      return await SeatMap.findByIdAndDelete(seatMapId);
    } catch (error) {
      console.error('Error deleting seat map:', error);
      throw error;
    }
  }

  async getSeatMap(seatMapId) {
    try {
      const seatMap = await SeatMap.findById(seatMapId);
      if (!seatMap) {
        throw new ApiError('Seat map not found', 404);
      }

      return seatMap;
    } catch (error) {
      console.error('Error getting seat map:', error);
      throw error;
    }
  }

  async getAllSeatMaps(filters = {}, options = {}) {
    try {
      const query = {};

      if (filters.busId) {
        query.busId = filters.busId;
      }

      const seatMapsQuery = SeatMap.find(query);

      if (options.sort) {
        seatMapsQuery.sort(options.sort);
      }

      if (options.page && options.limit) {
        const page = parseInt(options.page, 10);
        const limit = parseInt(options.limit, 10);
        const skip = (page - 1) * limit;
        seatMapsQuery.skip(skip).limit(limit);
      }

      const [seatMaps, total] = await Promise.all([seatMapsQuery.exec(), SeatMap.countDocuments(query)]);

      return {
        seatMaps,
        total,
        page: options.page ? parseInt(options.page, 10) : 1,
        limit: options.limit ? parseInt(options.limit, 10) : total,
      };
    } catch (error) {
      console.error('Error getting all seat maps:', error);
      throw error;
    }
  }

  validateSeatLayout(layout) {
    const seatNumbers = layout.map((seat) => seat.seatNumber);
    const uniqueSeatNumbers = new Set(seatNumbers);
    if (seatNumbers.length !== uniqueSeatNumbers.size) {
      throw new ApiError('Duplicate seat numbers found in layout', 400);
    }

    const invalidSeats = layout.filter(
      (seat) => seat.row < 0 || seat.column < 0 || typeof seat.row !== 'number' || typeof seat.column !== 'number'
    );

    if (invalidSeats.length > 0) {
      throw new ApiError('Invalid row or column values in layout', 400);
    }

    const validTypes = ['regular', 'luxury', 'disabled'];
    const invalidTypes = layout.filter((seat) => !validTypes.includes(seat.type));
    if (invalidTypes.length > 0) {
      throw new ApiError('Invalid seat types found in layout', 400);
    }
  }

  async validateSeatUpdateWithBookings(busId, newLayout) {
    const activeTrips = await Trip.find({
      busId,
      status: { $in: ['scheduled', 'in-progress'] },
    });

    if (activeTrips.length === 0) return true;

    const tripIds = activeTrips.map((trip) => trip._id);
    const bookings = await Booking.find({
      tripId: { $in: tripIds },
      status: 'confirmed',
    });

    const bookedSeatNumbers = new Set(bookings.flatMap((booking) => booking.seatNumbers));

    const modifiedBookedSeats = newLayout.filter(
      (seat) => bookedSeatNumbers.has(seat.seatNumber) && (!seat.isActive || seat.type !== 'regular')
    );

    if (modifiedBookedSeats.length > 0) {
      throw new ApiError('Cannot modify seats that are currently booked', 400);
    }

    return true;
  }

  async getSeatAvailabilityMatrix(busId, date) {
    try {
      const seatMap = await SeatMap.findOne({ busId });
      if (!seatMap) {
        throw new ApiError('Seat map not found', 404);
      }

      const trips = await Trip.find({
        busId,
        departureDate: {
          $gte: new Date(date),
          $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
        },
      });

      const availabilityMatrix = {};

      seatMap.layout.forEach((seat) => {
        availabilityMatrix[seat.seatNumber] = {
          seatDetails: seat,
          availability: trips.map((trip) => ({
            tripId: trip._id,
            departureDate: trip.departureDate,
            available: true,
          })),
        };
      });

      const tripIds = trips.map((trip) => trip._id);
      const bookings = await Booking.find({
        tripId: { $in: tripIds },
        status: 'confirmed',
      });

      bookings.forEach((booking) => {
        booking.seatNumbers.forEach((seatNumber) => {
          const seatAvailability = availabilityMatrix[seatNumber];
          if (seatAvailability) {
            const tripAvailability = seatAvailability.availability.find(
              (a) => a.tripId.toString() === booking.tripId.toString()
            );
            if (tripAvailability) {
              tripAvailability.available = false;
            }
          }
        });
      });

      return availabilityMatrix;
    } catch (error) {
      console.error('Error getting seat availability matrix:', error);
      throw error;
    }
  }
}

module.exports = new SeatMapService();
