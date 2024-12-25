const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Bus = require('../models/Bus');
const Trip = require('../models/Trip');
const { ApiError } = require('../utils/responses');

class BookingService {
  async createBooking(bookingData, userId) {
    let session = null;
    const { tripId, seatNumber } = bookingData;

    try {
      session = await mongoose.startSession();
      session.startTransaction();

      if (!mongoose.Types.ObjectId.isValid(tripId)) {
        throw new ApiError('Invalid tripId provided', 400);
      }
      if (!seatNumber) {
        throw new ApiError('Seat number is required', 400);
      }

      const trip = await Trip.findById(tripId).populate('bus').populate('route').session(session);

      if (!trip) {
        throw new ApiError('Trip not found', 404);
      }
      if (trip.availableSeats <= 0) {
        throw new ApiError('No seats available for this trip', 400);
      }

      const seat = trip.bus.seats.find((s) => s.seatNumber === seatNumber && !s.isBooked);

      if (!seat) {
        throw new ApiError('Seat not available or already booked', 400);
      }

      const booking = new Booking({
        trip: tripId,
        user: userId,
        seat: seatNumber,
        price: trip.route.price,
        status: 'CONFIRMED',
      });

      const [updatedBus, updatedTrip] = await Promise.all([
        Bus.findOneAndUpdate(
          {
            _id: trip.bus._id,
            'seats.seatNumber': seatNumber,
          },
          {
            $set: { 'seats.$.isBooked': true },
          },
          { session, new: true }
        ),
        Trip.findByIdAndUpdate(tripId, { $inc: { availableSeats: -1 } }, { session, new: true }),
        booking.save({ session }),
      ]);

      if (!updatedBus || !updatedTrip) {
        throw new ApiError('Failed to update booking information', 500);
      }

      await session.commitTransaction();

      return await booking.populate([
        { path: 'trip', populate: ['route', 'bus'] },
        { path: 'user', select: 'name email' },
      ]);
    } catch (error) {
      if (session) {
        await session.abortTransaction();
      }
      console.error('Error during createBooking:', error.message, {
        tripId,
        userId,
        seatNumber,
        errorStack: error.stack,
      });
      throw error;
    } finally {
      if (session) {
        await session.endSession();
      }
    }
  }

  async cancelBooking(bookingId, userId) {
    let session = null;

    try {
      session = await mongoose.startSession();
      session.startTransaction();

      const booking = await Booking.findOne({
        _id: bookingId,
        user: userId,
        status: 'CONFIRMED',
      }).session(session);

      if (!booking) {
        throw new ApiError('Booking not found or already cancelled', 404);
      }

      booking.status = 'CANCELLED';

      const [updatedTrip] = await Promise.all([
        Trip.findOneAndUpdate(
          {
            _id: booking.trip,
            'bus.seats.seatNumber': booking.seat,
          },
          {
            $set: {
              'bus.seats.$.isBooked': false,
            },
            $inc: { availableSeats: 1 },
          },
          { session, new: true }
        ),
        booking.save({ session }),
      ]);

      if (!updatedTrip) {
        throw new ApiError('Failed to update trip', 500);
      }

      await session.commitTransaction();
      return booking;
    } catch (error) {
      if (session) {
        try {
          await session.abortTransaction();
        } catch (abortError) {
          console.error('Error aborting transaction:', abortError);
        }
      }

      if (error.name === 'MongoExpiredSessionError') {
        throw new ApiError('Transaction timeout. Please try again.', 500);
      }
      throw error;
    } finally {
      if (session) {
        try {
          await session.endSession();
        } catch (endError) {
          console.error('Error ending session:', endError);
        }
      }
    }
  }

  async getAllBookings(filters = {}, options = {}) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.tripId) {
      query.trip = filters.tripId;
    }
    if (filters.startDate && filters.endDate) {
      query.bookedAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate),
      };
    }

    const bookingsQuery = Booking.find(query)
      .populate({
        path: 'trip',
        populate: ['route', 'bus'],
      })
      .populate('user', 'username');

    if (options.sort) {
      bookingsQuery.sort(options.sort);
    } else {
      bookingsQuery.sort('-bookedAt');
    }

    if (options.page && options.limit) {
      const page = parseInt(options.page);
      const limit = parseInt(options.limit);
      const skip = (page - 1) * limit;
      bookingsQuery.skip(skip).limit(limit);
    }

    const [bookings, total] = await Promise.all([bookingsQuery.exec(), Booking.countDocuments(query)]);

    return {
      bookings,
      total,
      page: options.page ? parseInt(options.page) : 1,
      limit: options.limit ? parseInt(options.limit) : total,
    };
  }
}

module.exports = new BookingService();
