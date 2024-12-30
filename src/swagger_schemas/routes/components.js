module.exports = {
  schemas: {
    RouteInput: {
      type: 'object',
      properties: {
        routeNumber: {
          type: 'string',
          description: 'The number of the route',
        },
        startLocation: {
          type: 'string',
          description: 'The starting location of the route',
        },
        endLocation: {
          type: 'string',
          description: 'The ending location of the route',
        },
        fare: {
          type: 'number',
          description: 'The fare for the route',
        },
        distance: {
          type: 'number',
          description: 'The total distance of the route',
        },
        schedules: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              departureTime: {
                type: 'string',
                format: 'date-time',
              },
              arrivalTime: {
                type: 'string',
                format: 'date-time',
              },
            },
          },
        },
        stops: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              distance: {
                type: 'number',
              },
              timeFromStart: {
                type: 'string',
              },
            },
          },
        },
      },
      required: ['routeNumber', 'startLocation', 'endLocation'],
    },
    Route: {
      type: 'object',
      properties: {
        routeNumber: {
          type: 'string',
          description: 'The number of the route',
        },
        startLocation: {
          type: 'string',
          description: 'The starting location of the route',
        },
        endLocation: {
          type: 'string',
          description: 'The ending location of the route',
        },
        fare: {
          type: 'number',
          description: 'The fare for the route',
        },
        distance: {
          type: 'number',
          description: 'The total distance of the route',
        },
        schedules: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              departureTime: {
                type: 'string',
                format: 'date-time',
              },
              arrivalTime: {
                type: 'string',
                format: 'date-time',
              },
            },
          },
        },
        stops: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
              },
              distance: {
                type: 'number',
              },
              timeFromStart: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  },
};
