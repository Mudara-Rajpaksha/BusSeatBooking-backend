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

      const booking = await Booking.findById(bookingId).session(session);

      if (!booking) {
        throw new ApiError('Booking not found', 404);
      }

      if (booking.status === 'CANCELLED') {
        throw new ApiError('Booking is already cancelled', 400);
      }

      if (!booking.user.equals(userId)) {
        throw new ApiError('You are not authorized to cancel this booking', 403);
      }

      const trip = await Trip.findById(booking.trip).populate('bus').session(session);

      if (!trip) {
        throw new ApiError('Associated trip not found', 404);
      }

      const seat = trip.bus.seats.find((s) => s.seatNumber === booking.seat && s.isBooked);

      if (!seat) {
        throw new ApiError('Seat not found or not booked', 400);
      }

      const [updatedBus, updatedTrip] = await Promise.all([
        Bus.findOneAndUpdate(
          { _id: trip.bus._id, 'seats.seatNumber': booking.seat },
          { $set: { 'seats.$.isBooked': false } },
          { session, new: true }
        ),
        Trip.findByIdAndUpdate(booking.trip, { $inc: { availableSeats: 1 } }, { session, new: true }),
      ]);

      if (!updatedBus || !updatedTrip) {
        throw new ApiError('Failed to update seat or trip information', 500);
      }

      booking.status = 'CANCELLED';
      await booking.save({ session });

      await session.commitTransaction();

      return await booking.populate([
        { path: 'trip', populate: ['route', 'bus'] },
        { path: 'user', select: 'name email' },
      ]);
    } catch (error) {
      if (session) {
        await session.abortTransaction();
      }
      console.error('Error during cancelBooking:', error.message, {
        bookingId,
        userId,
        errorStack: error.stack,
      });
      throw error;
    } finally {
      if (session) {
        await session.endSession();
      }
    }
  }

  async getAllBookings(filters = {}, options = {}, userId = null) {
    const query = {};

    if (userId) {
      query.user = userId;
    }

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
      const page = parseInt(options.page, 10);
      const limit = parseInt(options.limit, 10);
      const skip = (page - 1) * limit;
      bookingsQuery.skip(skip).limit(limit);
    }

    const [bookings, total] = await Promise.all([bookingsQuery.exec(), Booking.countDocuments(query)]);

    return {
      bookings,
      total,
      page: options.page ? parseInt(options.page, 10) : 1,
      limit: options.limit ? parseInt(options.limit, 10) : total,
    };
  }
}

module.exports = new BookingService();
