const Bus = require('../models/Bus');
const { ApiError } = require('../utils/responses');

class BusService {
  async addBus(busData) {
    const { registrationNumber } = busData;

    const existingBus = await Bus.findOne({
      registrationNumber,
      isActive: true,
    });

    if (existingBus) {
      throw new ApiError('Bus with this registration number already exists', 409);
    }

    if (!busData.seats) {
      busData.seats = [{ seatNumber: 'A1' }, { seatNumber: 'A2' }, { seatNumber: 'B1' }, { seatNumber: 'B2' }];
    }

    const bus = new Bus(busData);
    await bus.save();
    return bus;
  }

  async getAllBuses(filters = {}, options = {}) {
    const query = Bus.find(filters);

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

module.exports = new BusService();
