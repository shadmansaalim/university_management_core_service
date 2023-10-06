// Imports
import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import authGuard from '../../middlewares/authGuard';
import validateRequest from '../../middlewares/validateRequest';
import { StudentEnrolledCourseController } from './studentEnrolledCourse.controller';
import { StudentEnrolledCourseValidation } from './studentEnrolledCourse.validation';

// Express router
const router = express.Router();

// API Endpoints
router.get(
  '/:id',
  StudentEnrolledCourseController.getSingleStudentEnrolledCourse
);

router.get('/', StudentEnrolledCourseController.getAllStudentEnrolledCourses);

router.post(
  '/',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(StudentEnrolledCourseValidation.create),
  StudentEnrolledCourseController.createStudentEnrolledCourse
);

router.patch(
  '/:id',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(StudentEnrolledCourseValidation.update),
  StudentEnrolledCourseController.updateSingleStudentEnrolledCourse
);

router.delete(
  '/:id',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  StudentEnrolledCourseController.deleteSingleStudentEnrolledCourse
);

export const StudentEnrolledCourseRoutes = router;
