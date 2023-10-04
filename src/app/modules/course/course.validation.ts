// Imports
import { z } from 'zod';

// Validation of POST API request using ZOD
const create = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
    code: z.string({
      required_error: 'Code is required',
    }),
    credits: z.number({
      required_error: 'Credits is required',
    }),
    preRequisiteCourses: z
      .array(
        z.object({
          courseId: z.string({}),
        })
      )
      .optional(),
  }),
});

// Validation of PATCH API request using ZOD
const update = z.object({
  body: z.object({
    title: z.string().optional(),
    code: z.string().optional(),
    credits: z.number().optional(),
    preRequisiteCourses: z
      .array(
        z.object({
          courseId: z.string({}),
          isDeleted: z.boolean({}).optional(),
        })
      )
      .optional(),
  }),
});

// Validation of API request using ZOD while assigning/removing faculties
const assignOrRemoveFaculties = z.object({
  body: z.object({
    faculties: z.array(z.string(), {
      required_error: 'Faculties are required to assign/remove from course.',
    }),
  }),
});

export const CourseValidation = {
  create,
  update,
  assignOrRemoveFaculties,
};
