// Imports
import { z } from 'zod';

// Validation of POST API request using ZOD
const create = z.object({
  body: z.object({
    academicDepartmentId: z.string({
      required_error: 'Academic Department Id is required',
    }),
    semesterRegistrationId: z.string({
      required_error: 'Semester Registration Id is required',
    }),
    courseIds: z.array(
      z.string({
        required_error: 'Course Id is required',
      }),
      {
        required_error: 'Course Ids are required',
      }
    ),
  }),
});

// Validation of PATCH API request using ZOD
const update = z.object({
  body: z.object({
    semesterRegistrationId: z.string().optional(),
    courseId: z.string().optional(),
    academicDepartmentId: z.string().optional(),
  }),
});

export const OfferedCourseValidation = {
  create,
  update,
};
