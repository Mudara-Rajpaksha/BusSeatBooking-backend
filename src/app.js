const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const { rateLimiter } = require('./middleware/rateLimiter');
const connectDB = require('./config/database');
const config = require('./config/config');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./config/swagger');

const app = express();

connectDB();

app.use(helmet());
app.use(
  cors({
    origin: config.CORS_ORIGIN,
    credentials: true,
  })
);
app.use('/api/auth', rateLimiter);
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(compression());

app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser(config.COOKIE_SECRET));

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use(
  '/api-docs',
  process.env.NODE_ENV === 'production'
    ? [
        rateLimiter,
        (req, res, next) => {
          const auth = { login: process.env.SWAGGER_USER, password: process.env.SWAGGER_PASSWORD };
          const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
          const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

          if (login && password && login === auth.login && password === auth.password) {
            return next();
          }
          res.set('WWW-Authenticate', 'Basic realm="Swagger Documentation"');
          res.status(401).send('Authentication required for API documentation.');
        },
      ]
    : [],
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'API Documentation',
    customfavIcon: '/assets/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  })
);
app.use('/api', routes);

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use(errorHandler);

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  });
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);

  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);

  process.exit(1);
});

const server = app.listen(config.PORT, () => {
  logger.info(`Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
});

const shutdown = () => {
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = app;
