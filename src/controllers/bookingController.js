const { ApiResponse, ApiError } = require('../utils/responses');
const BookingService = require('../services/bookingService');

class BookingController {
  async findAvailableTrips(req, res, next) {
    try {
      const { fromStop, toStop, date } = req.query;

      if (!fromStop || !toStop || !date) {
        return res.status(400).json(new ApiResponse('Missing required query parameters', null, false));
      }

      const trips = await BookingService.findAvailableTrips(fromStop, toStop, date);
      res.json(new ApiResponse('Available trips retrieved successfully', trips));
    } catch (error) {
      next(new ApiError(error.message || 'Error retrieving available trips', error.status || 500));
    }
  }

  async getSeatAvailability(req, res, next) {
    try {
      const { tripId } = req.params;
      const { fromStop, toStop } = req.query;

      if (!tripId || !fromStop || !toStop) {
        return res.status(400).json(new ApiResponse('Missing required parameters', null, false));
      }

      const seatAvailability = await BookingService.getSeatAvailability(tripId, fromStop, toStop);
      res.json(new ApiResponse('Seat availability retrieved successfully', seatAvailability));
    } catch (error) {
      next(new ApiError(error.message || 'Error retrieving seat availability', error.status || 500));
    }
  }

  async createBooking(req, res, next) {
    try {
      const bookingData = req.body;

      if (
        !bookingData.tripId ||
        !bookingData.userId ||
        !bookingData.seatIds ||
        !bookingData.fromStop ||
        !bookingData.toStop
      ) {
        return res.status(400).json(new ApiResponse('Missing required booking data', null, false));
      }

      const booking = await BookingService.createBooking(bookingData);
      res.status(201).json(new ApiResponse('Booking created successfully', booking));
    } catch (error) {
      next(new ApiError(error.message || 'Error creating booking', error.status || 500));
    }
  }

  async updateBooking(req, res, next) {
    try {
      const { bookingId } = req.params;
      const updateData = req.body;

      if (!bookingId) {
        return res.status(400).json(new ApiResponse('Missing booking ID', null, false));
      }

      const updatedBooking = await BookingService.updateBooking(bookingId, updateData);
      res.json(new ApiResponse('Booking updated successfully', updatedBooking));
    } catch (error) {
      next(new ApiError(error.message || 'Error updating booking', error.status || 500));
    }
  }

  async cancelBooking(req, res, next) {
    try {
      const { bookingId } = req.params;

      if (!bookingId) {
        return res.status(400).json(new ApiResponse('Missing booking ID', null, false));
      }

      const cancelledBooking = await BookingService.cancelBooking(bookingId);
      res.json(new ApiResponse('Booking cancelled successfully', cancelledBooking));
    } catch (error) {
      next(new ApiError(error.message || 'Error cancelling booking', error.status || 500));
    }
  }

  async getBookingDetails(req, res, next) {
    try {
      const { bookingId } = req.params;

      if (!bookingId) {
        return res.status(400).json(new ApiResponse('Missing booking ID', null, false));
      }

      const bookingDetails = await BookingService.getBookingDetails(bookingId);
      res.json(new ApiResponse('Booking details retrieved successfully', bookingDetails));
    } catch (error) {
      next(new ApiError(error.message || 'Error retrieving booking details', error.status || 500));
    }
  }

  async getUserBookings(req, res, next) {
    try {
      const { userId, status } = req.query;

      if (!userId) {
        return res.status(400).json(new ApiResponse('Missing user ID', null, false));
      }

      const userBookings = await BookingService.getUserBookings(userId, status);
      res.json(new ApiResponse('User bookings retrieved successfully', userBookings));
    } catch (error) {
      next(new ApiError(error.message || 'Error retrieving user bookings', error.status || 500));
    }
  }

  async getAllBookings(req, res, next) {
    try {
      const bookings = await BookingService.getAllBookings();
      res.json(new ApiResponse('All bookings retrieved successfully', bookings));
    } catch (error) {
      next(new ApiError(error.message || 'Error retrieving all bookings', error.status || 500));
    }
  }
}

module.exports = new BookingController();
