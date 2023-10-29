// Imports
import { Server } from 'http';
import app from './app';
import subscribeToEvents from './app/events';
import config from './config';
import { errorLogger, logger } from './shared/logger';
import { RedisClient } from './shared/redis';

// Database connection
async function bootstrap() {
  await RedisClient.connect().then(() => subscribeToEvents());
  // Server
  const server: Server = app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
  });

  // Exit Handler
  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    errorLogger.error(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}
// Calling the function
bootstrap();
