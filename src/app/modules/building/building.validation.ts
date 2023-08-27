// Imports
import { z } from 'zod';

// Validation of POST API request using ZOD
const createBuildingZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
  }),
});

// Validation of PATCH API request using ZOD
const updateBuildingZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
  }),
});

export const BuildingValidation = {
  createBuildingZodSchema,
  updateBuildingZodSchema,
};
