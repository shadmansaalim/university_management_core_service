// Imports
import { z } from 'zod';

// Validation of POST API request using ZOD
const create = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
  }),
});

// Validation of PATCH API request using ZOD
const update = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
  }),
});

export const BuildingValidation = {
  create,
  update,
};
