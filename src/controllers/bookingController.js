const bookingService = require('../services/bookingService');
const { ApiResponse } = require('../utils/responses');

class BookingController {
  async createBooking(req, res, next) {
    try {
      const booking = await bookingService.createBooking(req.body, req.user._id);
      res.status(201).json(new ApiResponse('Booking created successfully', booking));
    } catch (error) {
      next(error);
    }
  }

  async cancelBooking(req, res, next) {
    try {
      const booking = await bookingService.cancelBooking(req.params.bookingId, req.user._id);
      res.json(new ApiResponse('Booking cancelled successfully', booking));
    } catch (error) {
      next(error);
    }
  }

  async getAllBookings(req, res, next) {
    try {
      const { status, tripId, startDate, endDate, page, limit, sort } = req.query;

      const filters = {
        status,
        tripId,
        startDate,
        endDate,
      };

      const options = {
        page,
        limit,
        sort,
      };

      const result = await bookingService.getAllBookings(filters, options);
      res.json(new ApiResponse('Bookings retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();
