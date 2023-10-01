// Imports
import { z } from 'zod';

// Validation of POST API request using ZOD
const createOfferedCourseSectionZodSchema = z.object({
  body: z.object({
    offeredCourseId: z.string({
      required_error: 'Offered course id is required',
    }),
    maxCapacity: z.number({
      required_error: 'Max capacity is required',
    }),
    title: z.string({
      required_error: 'Title is required',
    }),
  }),
});

// Validation of PATCH API request using ZOD
const updateOfferedCourseSectionZodSchema = z.object({
  body: z.object({
    maxCapacity: z.number().optional(),
    title: z.string().optional(),
  }),
});

export const OfferedCourseSectionValidation = {
  createOfferedCourseSectionZodSchema,
  updateOfferedCourseSectionZodSchema,
};
