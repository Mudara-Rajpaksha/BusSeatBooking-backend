const Route = require('../models/Route');
const { ApiError } = require('../utils/responses');

class RouteService {
  async addRoute(routeData, createdBy) {
    const { origin, destination, schedule, operator, price } = routeData;

    const existingRoute = await Route.findOne({
      origin,
      destination,
      schedule,
      isActive: true,
    });

    if (existingRoute) {
      throw new ApiError('Route already exists', 409);
    }

    const route = new Route({
      origin,
      destination,
      schedule,
      operator,
      price,
      createdBy,
    });

    await route.save();
    return route;
  }

  async getAllRoutes(filters = {}, options = {}) {
    const query = Route.find(filters);

    if (options.sort) {
      query.sort(options.sort);
    }

    if (options.select) {
      query.select(options.select);
    }

    if (options.limit) {
      query.limit(parseInt(options.limit));
    }
    if (options.skip) {
      query.skip(parseInt(options.skip));
    }

    return await query.exec();
  }
}

module.exports = new RouteService();
