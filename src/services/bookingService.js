const { SeatMap, Trip, Booking } = require('../models/Booking');
const { ApiError } = require('../utils/responses');

class BookingService {
  async findAvailableTrips(fromStop, toStop, date) {
    try {
      const trips = await Trip.find({
        departureDate: {
          $gte: new Date(date),
          $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
        },
        'intermediateStops.stopName': {
          $all: [fromStop, toStop],
        },
        status: 'scheduled',
        availableSeats: { $gt: 0 },
      }).populate('routeId busId');

      return trips.map((trip) => {
        const fromStopIndex = trip.intermediateStops.findIndex((stop) => stop.stopName === fromStop);
        const toStopIndex = trip.intermediateStops.findIndex((stop) => stop.stopName === toStop);
        const fare =
          trip.intermediateStops[toStopIndex].fareFromStart - trip.intermediateStops[fromStopIndex].fareFromStart;

        return {
          ...trip.toObject(),
          calculatedFare: fare,
        };
      });
    } catch (error) {
      console.error('Error finding available trips:', error);
      throw error;
    }
  }

  async getSeatAvailability(tripId, fromStop, toStop) {
    try {
      const trip = await Trip.findById(tripId);
      if (!trip) {
        throw new ApiError('Trip not found', 404);
      }

      const overlappingBookings = await Booking.find({
        tripId,
        status: 'confirmed',
        $or: [
          {
            fromStop: { $gte: fromStop, $lt: toStop },
          },
          {
            toStop: { $gt: fromStop, $lte: toStop },
          },
        ],
      });

      const seatMap = await SeatMap.findOne({ busId: trip.busId });

      const availableSeats = seatMap.layout.map((seat) => ({
        ...seat.toObject(),
        _id: seat._id,
        isAvailable: !overlappingBookings.some((booking) => booking.seatIds.includes(seat._id.toString())),
      }));

      return availableSeats;
    } catch (error) {
      console.error('Error getting seat availability:', error);
      throw error;
    }
  }

  async createBooking(bookingData) {
    try {
      const { tripId, userId, seatIds, fromStop, toStop } = bookingData;

      const trip = await Trip.findById(tripId);
      if (!trip) {
        throw new ApiError('Trip not found', 404);
      }

      if (trip.status !== 'scheduled') {
        throw new ApiError('Trip is not available for booking', 400);
      }

      const seatMap = await SeatMap.findOne({ busId: trip.busId });
      if (!seatMap) {
        throw new ApiError('Seat map not found for this bus', 404);
      }

      const validSeatIds = seatMap.layout.map((seat) => seat._id.toString());
      const areValidSeatIds = seatIds.every((seatId) => validSeatIds.includes(seatId));

      if (!areValidSeatIds) {
        throw new ApiError('One or more invalid seat IDs', 400);
      }

      const seatAvailability = await this.getSeatAvailability(tripId, fromStop, toStop);
      const areSeatsAvailable = seatIds.every((seatId) =>
        seatAvailability.some((seat) => seat._id.toString() === seatId && seat.isAvailable)
      );

      if (!areSeatsAvailable) {
        throw new ApiError('One or more selected seats are not available', 400);
      }

      const selectedSeats = seatMap.layout.filter((seat) => seatIds.includes(seat._id.toString()));
      const seatNumbers = selectedSeats.map((seat) => seat.seatNumber);

      const fromStopIndex = trip.intermediateStops.findIndex((stop) => stop.stopName === fromStop);
      const toStopIndex = trip.intermediateStops.findIndex((stop) => stop.stopName === toStop);
      const farePerSeat =
        trip.intermediateStops[toStopIndex].fareFromStart - trip.intermediateStops[fromStopIndex].fareFromStart;
      const totalFare = farePerSeat * seatIds.length;

      const booking = new Booking({
        tripId,
        userId,
        seatIds,
        seatNumbers,
        fromStop,
        toStop,
        totalFare,
        status: 'pending',
      });

      await booking.save();

      await Trip.findByIdAndUpdate(tripId, {
        $inc: { availableSeats: -seatIds.length },
      });

      return booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async updateBooking(bookingId, updateData) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new ApiError('Booking not found', 404);
      }

      if (booking.status === 'cancelled') {
        throw new ApiError('Cannot update cancelled booking', 400);
      }

      if (booking.status === 'confirmed' && booking.paymentStatus === 'completed') {
        throw new ApiError('Cannot update confirmed and paid booking', 400);
      }

      const trip = await Trip.findById(booking.tripId);
      if (!trip) {
        throw new ApiError('Trip not found', 404);
      }

      if (updateData.seatIds) {
        await Trip.findByIdAndUpdate(booking.tripId, {
          $inc: { availableSeats: booking.seatIds.length },
        });

        const seatAvailability = await this.getSeatAvailability(
          booking.tripId,
          updateData.fromStop || booking.fromStop,
          updateData.toStop || booking.toStop
        );

        const areSeatsAvailable = updateData.seatIds.every((seatId) =>
          seatAvailability.some((seat) => seat._id.toString() === seatId && seat.isAvailable)
        );

        if (!areSeatsAvailable) {
          throw new ApiError('One or more selected seats are not available', 400);
        }

        const seatMap = await SeatMap.findOne({ busId: trip.busId });
        const selectedSeats = seatMap.layout.filter((seat) => updateData.seatIds.includes(seat._id.toString()));
        updateData.seatNumbers = selectedSeats.map((seat) => seat.seatNumber);

        await Trip.findByIdAndUpdate(booking.tripId, {
          $inc: { availableSeats: -updateData.seatIds.length },
        });
      }

      if (updateData.fromStop || updateData.toStop || updateData.seatIds) {
        const fromStop = updateData.fromStop || booking.fromStop;
        const toStop = updateData.toStop || booking.toStop;
        const seatCount = updateData.seatIds ? updateData.seatIds.length : booking.seatIds.length;

        const fromStopIndex = trip.intermediateStops.findIndex((stop) => stop.stopName === fromStop);
        const toStopIndex = trip.intermediateStops.findIndex((stop) => stop.stopName === toStop);
        const farePerSeat =
          trip.intermediateStops[toStopIndex].fareFromStart - trip.intermediateStops[fromStopIndex].fareFromStart;
        updateData.totalFare = farePerSeat * seatCount;
      }

      const updatedBooking = await Booking.findByIdAndUpdate(bookingId, { $set: updateData }, { new: true });

      return updatedBooking;
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  async cancelBooking(bookingId) {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        throw new ApiError('Booking not found', 404);
      }

      if (booking.status === 'cancelled') {
        throw new ApiError('Booking is already cancelled', 400);
      }

      const trip = await Trip.findById(booking.tripId);
      if (!trip) {
        throw new ApiError('Trip not found', 404);
      }

      if (trip.status !== 'scheduled') {
        throw new ApiError('Cannot cancel booking for trip that has started or completed', 400);
      }

      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          $set: {
            status: 'cancelled',
            paymentStatus: booking.paymentStatus === 'completed' ? 'refunded' : 'cancelled',
          },
        },
        { new: true }
      );

      await Trip.findByIdAndUpdate(booking.tripId, {
        $inc: { availableSeats: booking.seatIds.length },
      });

      return updatedBooking;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  async getBookingDetails(bookingId) {
    try {
      const booking = await Booking.findById(bookingId).populate({
        path: 'tripId',
        populate: {
          path: 'routeId busId',
        },
      });

      if (!booking) {
        throw new ApiError('Booking not found', 404);
      }

      return booking;
    } catch (error) {
      console.error('Error getting booking details:', error);
      throw error;
    }
  }

  async getUserBookings(userId, status) {
    try {
      const query = { userId };
      if (status) {
        query.status = status;
      }

      const bookings = await Booking.find(query)
        .populate({
          path: 'tripId',
          populate: {
            path: 'routeId busId',
          },
        })
        .sort({ bookingDate: -1 });

      return bookings;
    } catch (error) {
      console.error('Error getting user bookings:', error);
      throw error;
    }
  }
}

module.exports = new BookingService();
