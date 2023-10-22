// Imports
import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import authGuard from '../../middlewares/authGuard';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.validation';

// Express router
const router = express.Router();

// API Endpoints

router.get('/', FacultyController.getAllFaculties);

router.get(
  '/my-courses',
  authGuard(ENUM_USER_ROLES.FACULTY),
  FacultyController.getMyCourses
);

router.get('/:id', FacultyController.getSingleFaculty);

router.post(
  '/',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(FacultyValidation.create),
  FacultyController.createFaculty
);

router.patch(
  '/:id',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(FacultyValidation.update),
  FacultyController.updateSingleFaculty
);

router.delete(
  '/:id',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  FacultyController.deleteSingleFaculty
);

router.post(
  '/:id/assign-courses',
  validateRequest(FacultyValidation.assignOrRemoveCourses),
  FacultyController.assignCoursesToFaculty
);

router.delete(
  '/:id/remove-courses',
  validateRequest(FacultyValidation.assignOrRemoveCourses),
  FacultyController.removeCoursesFromFaculty
);

export const FacultyRoutes = router;
