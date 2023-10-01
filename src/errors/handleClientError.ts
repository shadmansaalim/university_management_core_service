// Imports
import { Prisma } from '@prisma/client';
import { IGenericErrorResponse } from '../interfaces/common';
import { IGenericErrorMessage } from '../interfaces/error';

// Handling Client Error function
const handleClientError = (
  error: Prisma.PrismaClientKnownRequestError
): IGenericErrorResponse => {
  let errors: IGenericErrorMessage[] = [];
  let message = '';
  const statusCode = 400;

  if (error.code === 'P2025') {
    message = (error.meta?.cause as string) || 'Record not found.';
    errors = [
      {
        path: '',
        message,
      },
    ];
  } else if (error.code === 'P2003') {
    if (error.message.includes('delete()` invocation:')) {
      message = 'Failed to delete.';
      errors = [
        {
          path: '',
          message,
        },
      ];
    }
  }

  return {
    statusCode,
    message,
    errorMessages: errors,
  };
};

export default handleClientError;
