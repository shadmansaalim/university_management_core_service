// Imports
import express from 'express';
import { AcademicSemesterController } from './academicSemester.controller';

// Express router
const router = express.Router();

// API Endpoints

router.post('/', AcademicSemesterController.insertIntoDB);

export const AcademicSemesterRoutes = router;
