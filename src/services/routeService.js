const Route = require('../models/Route');
const User = require('../models/User');
const { ApiError } = require('../utils/responses');

class RouteService {
  async addRoute(routeData, createdBy) {
    const { origin, destination, schedule, operator, price } = routeData;

    const operatorUser = await User.findOne({ _id: operator, role: 'operator' });
    if (!operatorUser) {
      throw new ApiError('Invalid operator or operator not found', 404);
    }

    const existingRoute = await Route.findOne({
      origin,
      destination,
      schedule,
      operator,
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

    await route.populate('operator', 'username role');
    return route;
  }

  async getAllRoutes(filters = {}, options = {}) {
    const query = Route.find(filters).populate('operator', 'username role');

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
