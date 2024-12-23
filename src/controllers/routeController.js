const routeService = require('../services/routeService');
const { ApiResponse } = require('../utils/responses');

class RouteController {
  async addRoute(req, res, next) {
    try {
      const route = await routeService.addRoute(req.body, req.user._id);
      res.status(201).json(new ApiResponse('Route added successfully', route));
    } catch (error) {
      next(error);
    }
  }

  async getAllRoutes(req, res, next) {
    try {
      const { origin, destination, sort, limit, skip } = req.query;

      const filters = {};
      if (origin) filters.origin = origin;
      if (destination) filters.destination = destination;

      const options = { sort, limit, skip };
      const routes = await routeService.getAllRoutes(filters, options);
      res.json(new ApiResponse('Routes retrieved successfully', routes));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RouteController();
