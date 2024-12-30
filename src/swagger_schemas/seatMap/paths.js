module.exports = {
  '/seatmaps/add': {
    post: {
      tags: ['SeatMap'],
      summary: 'Create a new seat map',
      description: 'Creates a new seat map for the specified bus.',
      operationId: 'createSeatMap',
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateSeatMap' },
          },
        },
      },
      responses: {
        201: {
          description: 'Seat map created successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SeatMap' },
            },
          },
        },
        400: { description: 'Invalid request data' },
        404: { description: 'Bus not found' },
      },
    },
  },

  '/seatmaps/{seatMapId}': {
    get: {
      tags: ['SeatMap'],
      summary: 'Get a specific seat map',
      description: 'Retrieve details of a specific seat map by its ID.',
      operationId: 'getSeatMap',
      parameters: [
        {
          name: 'seatMapId',
          in: 'path',
          required: true,
          description: 'ID of the seat map to retrieve',
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: {
          description: 'Seat map details retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SeatMap' },
            },
          },
        },
        404: { description: 'Seat map not found' },
      },
    },
    put: {
      tags: ['SeatMap'],
      summary: 'Update a seat map',
      description: 'Update a seat map layout for a specific bus.',
      operationId: 'updateSeatMap',
      parameters: [
        {
          name: 'seatMapId',
          in: 'path',
          required: true,
          description: 'ID of the seat map to update',
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateSeatMap' },
          },
        },
      },
      responses: {
        200: {
          description: 'Seat map updated successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SeatMap' },
            },
          },
        },
        400: { description: 'Invalid seat map data' },
        404: { description: 'Seat map not found' },
      },
    },
    delete: {
      tags: ['SeatMap'],
      summary: 'Delete a seat map',
      description: 'Deletes a seat map if no active trips are associated with it.',
      operationId: 'deleteSeatMap',
      parameters: [
        {
          name: 'seatMapId',
          in: 'path',
          required: true,
          description: 'ID of the seat map to delete',
          schema: { type: 'string' },
        },
      ],
      responses: {
        200: { description: 'Seat map deleted successfully' },
        400: { description: 'Cannot delete seat map with active trips' },
        404: { description: 'Seat map not found' },
      },
    },
  },

  '/seatmaps': {
    get: {
      tags: ['SeatMap'],
      summary: 'Get all seat maps',
      description: 'Retrieve all seat maps with optional filters and pagination.',
      operationId: 'getAllSeatMaps',
      parameters: [
        {
          name: 'busId',
          in: 'query',
          description: 'Filter seat maps by bus ID',
          schema: { type: 'string' },
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
          description: 'Number of seat maps per page',
          schema: { type: 'integer' },
        },
      ],
      responses: {
        200: {
          description: 'List of seat maps retrieved successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  seatMaps: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/SeatMap' },
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

  '/seatmaps/availability': {
    get: {
      tags: ['SeatMap'],
      summary: 'Check seat availability for a bus on a specific date',
      description: 'Checks availability of seats on a bus for a specific date.',
      operationId: 'getSeatAvailabilityMatrix',
      parameters: [
        {
          name: 'busId',
          in: 'query',
          required: true,
          description: 'Bus ID for checking availability',
          schema: { type: 'string' },
        },
        {
          name: 'date',
          in: 'query',
          required: true,
          description: 'Date to check availability for',
          schema: { type: 'string', format: 'date-time' },
        },
      ],
      responses: {
        200: {
          description: 'Seat availability matrix retrieved successfully',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SeatAvailability' },
            },
          },
        },
        404: { description: 'Bus or seat map not found' },
        400: { description: 'Invalid date or bus ID' },
      },
    },
  },
};
