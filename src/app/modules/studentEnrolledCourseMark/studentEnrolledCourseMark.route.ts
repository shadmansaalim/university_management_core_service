// Imports
import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import authGuard from '../../middlewares/authGuard';
import validateRequest from '../../middlewares/validateRequest';
import { StudentEnrolledCourseMarkController } from './studentEnrolledCourseMark.controller';
import { StudentEnrolledCourseMarkValidation } from './studentEnrolledCourseMark.validation';

// Express router
const router = express.Router();

// API Endpoints

router.get(
  '/',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.FACULTY),
  StudentEnrolledCourseMarkController.getAllStudentEnrolledCourseMarks
);

router.get(
  '/my-marks',
  authGuard(ENUM_USER_ROLES.STUDENT),
  StudentEnrolledCourseMarkController.getMyCourseMarks
);

router.patch(
  '/update-marks',
  validateRequest(StudentEnrolledCourseMarkValidation.updateStudentMarks),
  authGuard(ENUM_USER_ROLES.FACULTY),
  StudentEnrolledCourseMarkController.updateStudentMarks
);

router.patch(
  '/evaluate-final-gpa',
  validateRequest(StudentEnrolledCourseMarkValidation.evaluateStudentFinalGpa),
  authGuard(ENUM_USER_ROLES.FACULTY),
  StudentEnrolledCourseMarkController.evaluateStudentFinalGpa
);

export const StudentEnrolledCourseMarkRoutes = router;
