//Imports
import { IAcademicDepartmentFilters } from '../app/modules/academicDepartment/academicDepartment.interface';
import { IAcademicFacultyFilters } from '../app/modules/academicFaculty/academicFaculty.interface';
import { IAcademicSemesterFilters } from '../app/modules/academicSemester/academicSemester.interface';
import { IStudentFilters } from '../app/modules/student/student.interface';
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

// Conditional Options Type
export type ConditionalOptions<T, K extends keyof T> = T[K] extends null
  ? []
  : [T[K]];

// Document Filters Type
export type IDocumentFilters =
  | IStudentFilters
  | IAcademicSemesterFilters
  | IAcademicDepartmentFilters
  | IAcademicFacultyFilters;

// User Name Type
export type UserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};
