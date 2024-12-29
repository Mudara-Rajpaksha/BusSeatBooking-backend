const mongoose = require('mongoose');
const Bus = require('../models/Bus');
const Permit = require('../models/Permit');
const Route = require('../models/Route');
const { ApiError } = require('../utils/responses');

class BusService {
  async createBus(busData) {
    try {
      const permit = await Permit.findById(busData.permit);
      if (!permit) {
        throw new ApiError('Permit not found', 404);
      }

      if (busData.routes && busData.routes.length > 0) {
        const routes = await Route.find({ _id: { $in: busData.routes } });
        if (routes.length !== busData.routes.length) {
          throw new ApiError('One or more routes not found', 404);
        }
      }

      const bus = new Bus(busData);
      return await bus.save();
    } catch (error) {
      console.error('Error during createBus:', error.message, error.stack);
      throw error;
    }
  }

  async updateBus(busId, updateData) {
    try {
      if (updateData.permit) {
        const permit = await Permit.findById(updateData.permit);
        if (!permit) {
          throw new ApiError('Permit not found', 404);
        }
      }

      if (updateData.routes && updateData.routes.length > 0) {
        const routes = await Route.find({ _id: { $in: updateData.routes } });
        if (routes.length !== updateData.routes.length) {
          throw new ApiError('One or more routes not found', 404);
        }
      }

      const bus = await Bus.findByIdAndUpdate(busId, updateData, { new: true });

      if (!bus) {
        throw new ApiError('Bus not found', 404);
      }

      return bus;
    } catch (error) {
      console.error('Error during updateBus:', error.message, error.stack);
      throw error;
    }
  }

  async deleteBus(busId) {
    try {
      const bus = await Bus.findByIdAndDelete(busId);

      if (!bus) {
        throw new ApiError('Bus not found', 404);
      }

      return bus;
    } catch (error) {
      console.error('Error during deleteBus:', error.message, error.stack);
      throw error;
    }
  }

  async getBus(busId) {
    try {
      const bus = await Bus.findById(busId).populate('permit routes');

      if (!bus) {
        throw new ApiError('Bus not found', 404);
      }

      return bus;
    } catch (error) {
      console.error('Error during getBus:', error.message, error.stack);
      throw error;
    }
  }

  async getAllBuses(filters = {}, options = {}) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.manufacturer) {
      query.manufacturer = filters.manufacturer;
    }

    const busesQuery = Bus.find(query).populate('permit routes');

    if (options.sort) {
      busesQuery.sort(options.sort);
    } else {
      busesQuery.sort('-yearOfManufacture');
    }

    if (options.page && options.limit) {
      const page = parseInt(options.page, 10);
      const limit = parseInt(options.limit, 10);
      const skip = (page - 1) * limit;
      busesQuery.skip(skip).limit(limit);
    }

    const [buses, total] = await Promise.all([busesQuery.exec(), Bus.countDocuments(query)]);

    return {
      buses,
      total,
      page: options.page ? parseInt(options.page, 10) : 1,
      limit: options.limit ? parseInt(options.limit, 10) : total,
    };
  }
}

module.exports = new BusService();
