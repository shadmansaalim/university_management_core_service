// Imports
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.validation';

// Express router
const router = express.Router();

// API Endpoints
router.get('/:id', FacultyController.getSingleFaculty);

router.get('/', FacultyController.getAllFaculties);

router.post(
  '/create-faculty',
  validateRequest(FacultyValidation.createFacultyZodSchema),
  FacultyController.createFaculty
);

router.patch(
  '/:id',
  validateRequest(FacultyValidation.updateFacultyZodSchema),
  FacultyController.updateSingleFaculty
);

router.delete('/:id', FacultyController.deleteSingleFaculty);

export const FacultyRoutes = router;
