// Imports
import { z } from 'zod';
import { DataConstants } from '../../../constants/data';

// Validation of API request using ZOD while creating STUDENT
const createStudentZodSchema = z.object({
  body: z.object({
    studentId: z.string({
      required_error: 'Student id is required',
    }),
    firstName: z.string({
      required_error: 'First name is required',
    }),
    middleName: z.string({
      required_error: 'Middle name is required',
    }),
    lastName: z.string({
      required_error: 'Last name is required',
    }),
    profileImage: z.string({
      required_error: 'Profile image is required',
    }),
    gender: z.enum([...DataConstants.gender] as [string, ...string[]], {
      required_error: 'Gender is required',
    }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email(),
    contactNo: z.string({
      required_error: 'Contact number is required',
    }),
    bloodGroup: z
      .enum([...DataConstants.bloodGroup] as [string, ...string[]])
      .optional(),
    academicSemesterId: z.string({
      required_error: 'Academic semester is required',
    }),
    academicDepartmentId: z.string({
      required_error: 'Academic department is required',
    }),
    academicFacultyId: z.string({
      required_error: 'Academic faculty is required',
    }),
  }),
});

export const StudentValidation = {
  createStudentZodSchema,
};
