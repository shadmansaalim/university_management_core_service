// Imports
import { z } from 'zod';

// Validation of POST API request using ZOD
const createAcademicSemesterZodSchema = z.object({
  body: z.object({
    year: z.string({
      required_error: 'Year is required',
    }),
    title: z.string({
      required_error: 'Title is required',
    }),
    code: z.string({
      required_error: 'Code is required',
    }),
    startMonth: z.string({
      required_error: 'Start Month is required',
    }),
    endMonth: z.string({
      required_error: 'End Month is required',
    }),
  }),
});

export const AcademicSemesterValidation = {
  createAcademicSemesterZodSchema,
};
