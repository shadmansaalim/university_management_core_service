// Imports
import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import authGuard from '../../middlewares/authGuard';
import validateRequest from '../../middlewares/validateRequest';
import { CourseController } from './course.controller';
import { CourseValidation } from './course.validation';

// Express router
const router = express.Router();

// API Endpoints
router.get('/:id', CourseController.getSingleCourse);

router.get('/', CourseController.getAllCourses);

router.post(
  '/',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(CourseValidation.create),
  CourseController.createCourse
);

router.patch(
  '/:id',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(CourseValidation.update),
  CourseController.updateSingleCourse
);

router.delete(
  '/:id',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  CourseController.deleteSingleCourse
);

router.post(
  '/:id/assign-faculties',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(CourseValidation.assignOrRemoveFaculties),
  CourseController.assignFacultiesToCourse
);

router.delete(
  '/:id/remove-faculties',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(CourseValidation.assignOrRemoveFaculties),
  CourseController.removeFacultiesFromCourse
);

export const CourseRoutes = router;
