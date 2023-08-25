// Imports
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterController } from './academicSemester.controller';
import { AcademicSemesterValidation } from './academicSemester.validation';

// Express router
const router = express.Router();

// API Endpoints
router.get('/', AcademicSemesterController.getAllFromDB);

router.post(
  '/',
  validateRequest(AcademicSemesterValidation.createAcademicSemesterZodSchema),
  AcademicSemesterController.insertIntoDB
);

export const AcademicSemesterRoutes = router;
