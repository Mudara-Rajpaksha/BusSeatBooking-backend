const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const { ApiError } = require('../utils/responses');

class BookingService {
  async createBooking(bookingData, userId) {
    const { tripId, seatNumber } = bookingData;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const trip = await Trip.findById(tripId).populate('bus').populate('route');

      if (!trip) {
        throw new ApiError('Trip not found', 404);
      }

      const seatExists = trip.bus.seats.some((seat) => seat.number === seatNumber && !seat.isBooked);

      if (!seatExists) {
        throw new ApiError('Seat not available', 400);
      }

      const booking = new Booking({
        trip: tripId,
        user: userId,
        seat: seatNumber,
        price: trip.route.price,
        status: 'CONFIRMED',
      });

      await Trip.findOneAndUpdate(
        {
          _id: tripId,
          'bus.seats.number': seatNumber,
        },
        {
          $set: {
            'bus.seats.$.isBooked': true,
          },
          $inc: { availableSeats: -1 },
        },
        { session }
      );

      await booking.save({ session });
      await session.commitTransaction();

      return booking.populate([
        { path: 'trip', populate: ['route', 'bus'] },
        { path: 'user', select: 'name email' },
      ]);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async cancelBooking(bookingId, userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const booking = await Booking.findOne({
        _id: bookingId,
        user: userId,
        status: 'CONFIRMED',
      });

      if (!booking) {
        throw new ApiError('Booking not found or already cancelled', 404);
      }

      booking.status = 'CANCELLED';

      await Trip.findOneAndUpdate(
        {
          _id: booking.trip,
          'bus.seats.number': booking.seat,
        },
        {
          $set: {
            'bus.seats.$.isBooked': false,
          },
          $inc: { availableSeats: 1 },
        },
        { session }
      );

      await booking.save({ session });
      await session.commitTransaction();

      return booking;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
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
