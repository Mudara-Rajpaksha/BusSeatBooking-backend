require('dotenv').config();

const emailConfig = {
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  from: process.env.EMAIL_FROM,
  retryAttempts: 3,
  retryDelay: 1000,
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  },
};

module.exports = emailConfig;
