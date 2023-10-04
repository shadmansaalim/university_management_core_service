// Imports
import { z } from 'zod';

// Validation of POST API request using ZOD
const create = z.object({
  body: z.object({
    roomNumber: z.string({
      required_error: 'Room number is required',
    }),
    floor: z.string({
      required_error: 'Floor is required',
    }),
    buildingId: z.string({
      required_error: 'Building id is required',
    }),
  }),
});

// Validation of PATCH API request using ZOD
const update = z.object({
  body: z.object({
    roomNumber: z.string().optional(),
    floor: z.string().optional(),
    buildingId: z.string().optional(),
  }),
});

export const RoomValidation = {
  create,
  update,
};
