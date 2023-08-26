// Imports
import { z } from 'zod';
import { DataConstants } from '../../../constants/data';

// Validation of API request using ZOD while creating FACULTY
const createFacultyZodSchema = z.object({
  body: z.object({
    facultyId: z.string({
      required_error: 'Faculty id is required',
    }),
    firstName: z.string({
      required_error: 'First name is required',
    }),
    lastName: z.string({
      required_error: 'Last name is required',
    }),
    middleName: z.string({
      required_error: 'Middle name is required',
    }),
    profileImage: z.string({
      required_error: 'Profile image is required',
    }),
    email: z.string({
      required_error: 'Email is required',
    }),
    contactNo: z.string({
      required_error: 'Contact no is required',
    }),
    gender: z
      .enum([...DataConstants.gender] as [string, ...string[]])
      .optional(),
    bloodGroup: z
      .enum([...DataConstants.bloodGroup] as [string, ...string[]])
      .optional(),
    designation: z.string({
      required_error: 'Designation is required',
    }),
    academicDepartmentId: z.string({
      required_error: 'Academic department is required',
    }),
    academicFacultyId: z.string({
      required_error: 'Academic faculty is required',
    }),
  }),
});

export const FacultyValidation = {
  createFacultyZodSchema,
};
