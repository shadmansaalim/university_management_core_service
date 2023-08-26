// Imports
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';

// Express router
const router = express.Router();

// API Endpoints
router.get('/:id', StudentController.getSingleStudent);

router.get('/', StudentController.getAllStudents);

router.post(
  '/create-student',
  validateRequest(StudentValidation.createStudentZodSchema),
  StudentController.createStudent
);

router.patch(
  '/:id',
  validateRequest(StudentValidation.updateStudentZodSchema),
  StudentController.updateSingleStudent
);

router.delete('/:id', StudentController.deleteSingleStudent);

export const StudentRoutes = router;
