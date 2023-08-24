// Imports
import path from 'path';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Destructuring
const { combine, timestamp, label, printf } = format;

// Custom Log Format
const customLogFormat = printf(({ level, message, label, timestamp }: any) => {
  // Modifying timestamp to display log in a readable format
  const date = new Date(timestamp);

  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${date.toDateString()} ${hour}:${minutes}:${seconds} [${label}] ${level}: ${message}`;
});

// Success Logger
const logger = createLogger({
  level: 'info',
  format: combine(label({ label: 'UM' }), timestamp(), customLogFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'successes',
        'UM-%DATE%-success.log'
      ),
      datePattern: 'YYYY-DD-MM-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

// Error Logger
const errorLogger = createLogger({
  level: 'error',
  format: combine(label({ label: 'UM' }), timestamp(), customLogFormat),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'winston',
        'errors',
        'UM-%DATE%-error.log'
      ),
      datePattern: 'YYYY-DD-MM-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

export { logger, errorLogger };
