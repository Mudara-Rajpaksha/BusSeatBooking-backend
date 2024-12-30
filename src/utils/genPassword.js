const crypto = require('crypto');

const generateSecurePassword = () => {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor((crypto.randomBytes(1)[0] / 256) * charset.length);
    password += charset[randomIndex];
  }

  return password;
};

module.exports = generateSecurePassword;
