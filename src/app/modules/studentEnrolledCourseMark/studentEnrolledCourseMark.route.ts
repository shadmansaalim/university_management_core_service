// Imports
import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import authGuard from '../../middlewares/authGuard';
import { StudentEnrolledCourseMarkController } from './studentEnrolledCourseMark.controller';

// Express router
const router = express.Router();

// API Endpoints

router.get(
  '/',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.FACULTY),
  StudentEnrolledCourseMarkController.getAllStudentEnrolledCourseMarks
);

router.patch(
  '/update-marks',
  StudentEnrolledCourseMarkController.updateStudentMarks
);

export const StudentEnrolledCourseMarkRoutes = router;
