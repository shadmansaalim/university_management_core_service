// Imports
import { SemesterRegistrationStatus } from '@prisma/client';
import { z } from 'zod';

// Validation of POST API request using ZOD
const create = z.object({
  body: z.object({
    startDate: z.string({
      required_error: 'Start date is required',
    }),
    endDate: z.string({
      required_error: 'End date is required',
    }),
    academicSemesterId: z.string({
      required_error: 'Academic semester id is required',
    }),
    minCredit: z.number({
      required_error: 'Min credit is required',
    }),
    maxCredit: z.number({
      required_error: 'Max credit is required',
    }),
  }),
});

// Validation of PATCH API request using ZOD
const update = z.object({
  body: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    academicSemesterId: z.string().optional(),
    status: z
      .enum(
        [...Object.values(SemesterRegistrationStatus)] as [string, ...string[]],
        {}
      )
      .optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
  }),
});

// Validation for enrollment/withdrawal of course request using ZOD
const enrollOrWithdrawCourse = z.object({
  body: z.object({
    offeredCourseId: z.string({
      required_error: 'Offered course id is required',
    }),
    offeredCourseSectionId: z.string({
      required_error: 'Offered course section id is required',
    }),
  }),
});

export const SemesterRegistrationValidation = {
  create,
  update,
  enrollOrWithdrawCourse,
};
