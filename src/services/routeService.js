const mongoose = require('mongoose');
const Route = require('../models/Route');
const { ApiError } = require('../utils/responses');

class RouteService {
  async createRoute(routeData) {
    try {
      if (!routeData.routeNumber || !routeData.startLocation || !routeData.endLocation) {
        throw new ApiError('Missing required fields', 400);
      }

      if (routeData.fare && routeData.schedules && routeData.schedules.length > 0) {
        const { departureTime, arrivalTime } = routeData.schedules[0];

        const stops = [
          {
            name: routeData.startLocation,
            distance: 0,
            timeFromStart: departureTime,
          },
          ...routeData.stops,
          {
            name: routeData.endLocation,
            distance: routeData.distance,
            timeFromStart: arrivalTime,
          },
        ];

        routeData.stops = stops;

        const route = new Route(routeData);
        return await route.save();
      }

      throw new ApiError('Invalid route data', 400);
    } catch (error) {
      console.error('Error during createRoute:', error.message, error.stack);
      throw error;
    }
  }

  async updateRoute(routeId, updateData) {
    try {
      const route = await Route.findByIdAndUpdate(routeId, updateData, { new: true });

      if (!route) {
        throw new ApiError('Route not found', 404);
      }

      return route;
    } catch (error) {
      console.error('Error during updateRoute:', error.message, error.stack);
      throw error;
    }
  }

  async deleteRoute(routeId) {
    try {
      const route = await Route.findByIdAndDelete(routeId);

      if (!route) {
        throw new ApiError('Route not found', 404);
      }

      return route;
    } catch (error) {
      console.error('Error during deleteRoute:', error.message, error.stack);
      throw error;
    }
  }

  async getRoute(routeId) {
    try {
      const route = await Route.findById(routeId).populate('buses');

      if (!route) {
        throw new ApiError('Route not found', 404);
      }

      return route;
    } catch (error) {
      console.error('Error during getRoute:', error.message, error.stack);
      throw error;
    }
  }

  async getAllRoutes(filters = {}, options = {}) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.routeNumber) {
      query.routeNumber = filters.routeNumber;
    }

    const routesQuery = Route.find(query).populate('buses');

    if (options.sort) {
      routesQuery.sort(options.sort);
    } else {
      routesQuery.sort('-routeNumber');
    }

    if (options.page && options.limit) {
      const page = parseInt(options.page, 10);
      const limit = parseInt(options.limit, 10);
      const skip = (page - 1) * limit;
      routesQuery.skip(skip).limit(limit);
    }

    const [routes, total] = await Promise.all([routesQuery.exec(), Route.countDocuments(query)]);

    return {
      routes,
      total,
      page: options.page ? parseInt(options.page, 10) : 1,
      limit: options.limit ? parseInt(options.limit, 10) : total,
    };
  }
}

module.exports = new RouteService();
