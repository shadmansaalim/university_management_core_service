//Imports
import { IGenericErrorMessage } from './error';

// Error response format
export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

// Generic Response Type
export type IGenericResponse<T> = {
  meta: {
    page?: number;
    limit?: number;
    total?: number;
  };
  data: T;
};
