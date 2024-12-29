const mongoose = require('mongoose');
const Permit = require('../models/Permit');
const { ApiError } = require('../utils/responses');

class PermitService {
  async createPermit(permitData) {
    try {
      const permit = new Permit(permitData);
      return await permit.save();
    } catch (error) {
      console.error('Error during createPermit:', error.message, error.stack);
      throw error;
    }
  }

  async updatePermit(permitId, updateData) {
    try {
      const permit = await Permit.findByIdAndUpdate(permitId, updateData, { new: true });

      if (!permit) {
        throw new ApiError('Permit not found', 404);
      }

      return permit;
    } catch (error) {
      console.error('Error during updatePermit:', error.message, error.stack);
      throw error;
    }
  }

  async deletePermit(permitId) {
    try {
      const permit = await Permit.findByIdAndDelete(permitId);

      if (!permit) {
        throw new ApiError('Permit not found', 404);
      }

      return permit;
    } catch (error) {
      console.error('Error during deletePermit:', error.message, error.stack);
      throw error;
    }
  }

  async getPermit(permitId) {
    try {
      const permit = await Permit.findById(permitId);

      if (!permit) {
        throw new ApiError('Permit not found', 404);
      }

      return permit;
    } catch (error) {
      console.error('Error during getPermit:', error.message, error.stack);
      throw error;
    }
  }

  async getAllPermits(filters = {}, options = {}) {
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.vehicleType) {
      query.vehicleType = filters.vehicleType;
    }

    const permitsQuery = Permit.find(query);

    if (options.sort) {
      permitsQuery.sort(options.sort);
    } else {
      permitsQuery.sort('-issuedDate');
    }

    if (options.page && options.limit) {
      const page = parseInt(options.page, 10);
      const limit = parseInt(options.limit, 10);
      const skip = (page - 1) * limit;
      permitsQuery.skip(skip).limit(limit);
    }

    const [permits, total] = await Promise.all([permitsQuery.exec(), Permit.countDocuments(query)]);

    return {
      permits,
      total,
      page: options.page ? parseInt(options.page, 10) : 1,
      limit: options.limit ? parseInt(options.limit, 10) : total,
    };
  }
}

module.exports = new PermitService();
