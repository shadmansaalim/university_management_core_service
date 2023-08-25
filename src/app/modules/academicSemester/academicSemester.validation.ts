// Imports
import { z } from 'zod';
import { AcademicSemesterConstants } from './academicSemester.constant';
import {
  IAcademicSemesterCodes,
  IAcademicSemesterMonths,
  IAcademicSemesterTitles,
} from './academicSemester.interface';

// Validation of POST API request using ZOD
const createAcademicSemesterZodSchema = z.object({
  body: z.object({
    title: z.enum(
      [...AcademicSemesterConstants.titles] as [
        IAcademicSemesterTitles,
        ...IAcademicSemesterTitles[]
      ],
      {
        required_error: 'Title is required',
      }
    ),
    year: z.string({
      required_error: 'Year is required',
    }),
    code: z.enum(
      [...AcademicSemesterConstants.codes] as [
        IAcademicSemesterCodes,
        ...IAcademicSemesterCodes[]
      ],
      {
        required_error: 'Code is required',
      }
    ),
    startMonth: z.enum(
      [...AcademicSemesterConstants.months] as [
        IAcademicSemesterMonths,
        ...IAcademicSemesterMonths[]
      ],
      {
        required_error: 'Start Month is required',
      }
    ),
    endMonth: z.enum(
      [...AcademicSemesterConstants.months] as [
        IAcademicSemesterMonths,
        ...IAcademicSemesterMonths[]
      ],
      {
        required_error: 'End Month is required',
      }
    ),
  }),
});

export const AcademicSemesterValidation = {
  createAcademicSemesterZodSchema,
};
