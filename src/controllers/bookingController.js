const bookingService = require('../services/bookingService');
const { ApiResponse } = require('../utils/responses');
const USER_ROLE = require('../enums/userRoles');

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

      let result;

      if (req.user.role === USER_ROLE.ADMIN) {
        result = await bookingService.getAllBookings(filters, options);
      } else if (req.user.role === USER_ROLE.COMMUTER) {
        result = await bookingService.getAllBookings(filters, options, req.user._id);
      } else {
        return res.status(403).json(new ApiResponse('Access denied.', null));
      }

      res.json(new ApiResponse('Bookings retrieved successfully.', result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();
