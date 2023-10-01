/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */

//Imports
import { ErrorRequestHandler } from 'express';
import httpStatus from 'http-status';
import config from '../../config';
import handleClientError from '../../errors/handleClientError';
import handleValidationError from '../../errors/handleValidationError';
import handleZodError from '../../errors/handleZodError';
import { IGenericErrorMessage } from '../../interfaces/error';
import { errorLogger } from '../../shared/logger';

// Initializing defaults
let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
let message = 'Something went wrong!';
let errorMessages: Array<IGenericErrorMessage> = [];

// Handling different type of errors
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const errorLists: Record<string, (error: any) => void> = {
  PrismaClientValidationError: function (error) {
    const formattedError = handleValidationError(error);
    // Destructuring
    ({ statusCode, message, errorMessages } = formattedError);
  },
  ZodError: function (error) {
    const formattedError = handleZodError(error);
    // Destructuring
    ({ statusCode, message, errorMessages } = formattedError);
  },
  ApiError: function (error) {
    statusCode = error?.statusCode;
    message = error?.message;
    errorMessages = error?.message ? [{ path: '', message: message }] : [];
  },
  PrismaClientKnownRequestError: function (error) {
    const formattedError = handleClientError(error);
    // Destructuring
    ({ statusCode, message, errorMessages } = formattedError);
  },
};

// Global Error Handler Function to create a specified format for different type of errors
const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  // Consoling on development or else logging the errors
  config.env === 'development'
    ? console.log('Global Error Handler : ', error)
    : errorLogger.error('globalErrorHandler ~ ', error);

  // Checked whether error type is in our Error Handler Object otherwise handled as generic error
  if (Object.hasOwnProperty.call(errorLists, error.constructor.name)) {
    // Calling the function from the object to handle the error after evaluating type
    errorLists[error.constructor.name](error);
  } else {
    message = error?.message;
    errorMessages = error?.message ? [{ path: '', message: message }] : [];
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    errorMessages: errorMessages,
    stack: config.env !== 'production' ? error?.stack : null,
  });
};

export default globalErrorHandler;
