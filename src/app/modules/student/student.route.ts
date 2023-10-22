// Imports
import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import authGuard from '../../middlewares/authGuard';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';

// Express router
const router = express.Router();

router.get('/', StudentController.getAllStudents);

router.get(
  '/my-courses',
  authGuard(ENUM_USER_ROLES.STUDENT),
  StudentController.getMyCourses
);

router.get(
  '/my-course-schedules',
  authGuard(ENUM_USER_ROLES.STUDENT),
  StudentController.getMyCourseSchedules
);

// API Endpoints
router.get('/:id', StudentController.getSingleStudent);

router.post(
  '/',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(StudentValidation.create),
  StudentController.createStudent
);

router.patch(
  '/:id',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(StudentValidation.update),
  StudentController.updateSingleStudent
);

router.delete(
  '/:id',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  StudentController.deleteSingleStudent
);

export const StudentRoutes = router;
