module.exports = {
  '/trips/add': {
    post: {
      tags: ['Trips'],
      summary: 'Create a new trip',
      description: 'Creates a new trip by validating route, bus, seat map, and time constraints.',
      operationId: 'createTrip',
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateTrip' },
          },
        },
      },
      responses: {
        201: {
          description: 'Trip created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Trip' },
            },
          },
        },
        400: { description: 'Invalid request parameters' },
        404: { description: 'Route or bus not found' },
      },
    },
  },

  '/trips/{tripId}': {
    get: {
      tags: ['Trips'],
      summary: 'Get trip details',
      description: 'Retrieve details of a specific trip',
      operationId: 'getTrip',
      parameters: [
        {
          name: 'tripId',
          in: 'path',
          required: true,
          description: 'ID of the trip to retrieve',
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: 'Trip details retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Trip' },
            },
          },
        },
        404: { description: 'Trip not found' },
      },
    },
    put: {
      tags: ['Trips'],
      summary: 'Update an existing trip',
      description: "Update a trip's status or arrival date.",
      operationId: 'updateTrip',
      parameters: [
        {
          name: 'tripId',
          in: 'path',
          required: true,
          description: 'ID of the trip to update',
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateTrip' },
          },
        },
      },
      responses: {
        200: {
          description: 'Trip updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Trip' },
            },
          },
        },
        404: { description: 'Trip not found' },
        400: { description: 'Invalid update data' },
      },
    },
    delete: {
      tags: ['Trips'],
      summary: 'Delete a trip',
      description: 'Deletes a trip if no confirmed bookings exist.',
      operationId: 'deleteTrip',
      parameters: [
        {
          name: 'tripId',
          in: 'path',
          required: true,
          description: 'ID of the trip to delete',
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Trip deleted successfully' },
        404: { description: 'Trip not found' },
        400: { description: 'Cannot delete trip with active bookings' },
      },
    },
  },

  '/trips/{tripId}/availability': {
    get: {
      tags: ['Trips'],
      summary: 'Check availability for a trip',
      description: 'Checks if the specified number of seats are available between two stops.',
      operationId: 'checkTripAvailability',
      parameters: [
        {
          name: 'tripId',
          in: 'path',
          required: true,
          description: 'ID of the trip to check availability for',
          schema: { type: 'string' },
        },
        {
          name: 'fromStop',
          in: 'query',
          required: true,
          description: 'From stop name',
          schema: { type: 'string' },
        },
        {
          name: 'toStop',
          in: 'query',
          required: true,
          description: 'To stop name',
          schema: { type: 'string' },
        },
        {
          name: 'seatCount',
          in: 'query',
          required: true,
          description: 'Number of seats to check availability for',
          schema: { type: 'integer' },
        },
      ],
      responses: {
        200: {
          description: 'Availability status for the trip',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TripAvailability' },
            },
          },
        },
        404: { description: 'Trip not found' },
        400: { description: 'Invalid stop names or seat count' },
      },
    },
  },

  '/trips': {
    get: {
      tags: ['Trips'],
      summary: 'Get all trips',
      description: 'Retrieve all trips with optional filters and pagination.',
      operationId: 'getAllTrips',
      parameters: [
        {
          name: 'status',
          in: 'query',
          description: 'Filter trips by status',
          schema: { type: 'string', enum: ['scheduled', 'cancelled'] },
        },
        {
          name: 'routeId',
          in: 'query',
          description: 'Filter trips by route ID',
          schema: { type: 'string' },
        },
        {
          name: 'busId',
          in: 'query',
          description: 'Filter trips by bus ID',
          schema: { type: 'string' },
        },
        {
          name: 'dateRange',
          in: 'query',
          description: 'Filter trips by departure date range',
          schema: {
            type: 'object',
            properties: {
              start: { type: 'string', format: 'date-time' },
              end: { type: 'string', format: 'date-time' },
            },
          },
        },
        {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination',
          schema: { type: 'integer' },
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Number of trips per page',
          schema: { type: 'integer' },
        },
      ],
      responses: {
        200: {
          description: 'List of trips',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  trips: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Trip' },
                  },
                  total: { type: 'integer' },
                  page: { type: 'integer' },
                  limit: { type: 'integer' },
                },
              },
            },
          },
        },
        400: { description: 'Invalid filters or pagination parameters' },
      },
    },
  },
};
