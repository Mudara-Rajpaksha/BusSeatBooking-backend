module.exports = {
  schemas: {
    Permit: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        routeId: { type: 'string' },
        busId: { type: 'string' },
        permitNumber: { type: 'string' },
        issuedDate: { type: 'string', format: 'date-time' },
        expiryDate: { type: 'string', format: 'date-time' },
        status: { type: 'string', enum: ['active', 'expired', 'revoked'] },
        vehicleType: { type: 'string', enum: ['bus', 'train', 'van'] },
        issuedBy: { type: 'string' },
      },
    },
    CreatePermit: {
      type: 'object',
      required: ['routeId', 'busId', 'permitNumber', 'issuedDate', 'expiryDate', 'vehicleType'],
      properties: {
        routeId: { type: 'string' },
        busId: { type: 'string' },
        permitNumber: { type: 'string' },
        issuedDate: { type: 'string', format: 'date-time' },
        expiryDate: { type: 'string', format: 'date-time' },
        vehicleType: { type: 'string', enum: ['bus', 'train', 'van'] },
      },
    },
    UpdatePermit: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['active', 'expired', 'revoked'] },
        expiryDate: { type: 'string', format: 'date-time' },
      },
    },
  },
};
