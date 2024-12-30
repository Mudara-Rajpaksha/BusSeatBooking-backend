module.exports = {
  schemas: {
    BusInput: {
      type: 'object',
      properties: {
        permit: {
          type: 'string',
          description: 'The ID of the permit associated with the bus',
        },
        manufacturer: {
          type: 'string',
          description: 'The manufacturer of the bus',
        },
        yearOfManufacture: {
          type: 'integer',
          description: 'The year the bus was manufactured',
        },
        routes: {
          type: 'array',
          items: {
            type: 'string',
            description: 'The IDs of the routes associated with the bus',
          },
        },
        status: {
          type: 'string',
          enum: ['active', 'inactive'],
          description: 'The current status of the bus',
        },
      },
      required: ['permit', 'manufacturer', 'yearOfManufacture'],
    },
    Bus: {
      type: 'object',
      properties: {
        permit: {
          type: 'object',
          $ref: '#/components/schemas/Permit',
        },
        manufacturer: {
          type: 'string',
          description: 'The manufacturer of the bus',
        },
        yearOfManufacture: {
          type: 'integer',
          description: 'The year the bus was manufactured',
        },
        routes: {
          type: 'array',
          items: {
            type: 'object',
            $ref: '#/components/schemas/Route',
          },
        },
        status: {
          type: 'string',
          enum: ['active', 'inactive'],
          description: 'The current status of the bus',
        },
      },
    },
  },
};
