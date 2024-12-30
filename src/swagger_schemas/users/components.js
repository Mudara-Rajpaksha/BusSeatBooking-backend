module.exports = {
  schemas: {
    User: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        email: { type: 'string' },
        mobile: { type: 'string' },
        username: { type: 'string' },
        role: { type: 'string', enum: ['admin', 'operator', 'commuter'] },
        verified: { type: 'boolean' },
        active: { type: 'boolean' },
      },
    },
    CreateUser: {
      type: 'object',
      required: ['firstname', 'lastname', 'email', 'mobile', 'username', 'role'],
      properties: {
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        email: { type: 'string' },
        mobile: { type: 'string' },
        username: { type: 'string' },
        role: { type: 'string', enum: ['admin', 'operator', 'commuter'] },
      },
    },
    UpdateUser: {
      type: 'object',
      properties: {
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        email: { type: 'string' },
        mobile: { type: 'string' },
        username: { type: 'string' },
        role: { type: 'string', enum: ['admin', 'operator', 'commuter'] },
      },
    },
  },
};
