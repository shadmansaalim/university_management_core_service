// Imports
import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import authGuard from '../../middlewares/authGuard';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseController } from './offeredCourse.controller';
import { OfferedCourseValidation } from './offeredCourse.validation';

// Express router
const router = express.Router();

// API Endpoints
router.get('/:id', OfferedCourseController.getSingleOfferedCourse);

router.get('/', OfferedCourseController.getAllOfferedCourses);

router.post(
  '/',
  validateRequest(OfferedCourseValidation.create),
  OfferedCourseController.createOfferedCourse
);

router.patch(
  '/:id',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(OfferedCourseValidation.update),
  OfferedCourseController.updateSingleOfferedCourse
);

router.delete(
  '/:id',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  OfferedCourseController.deleteSingleOfferedCourse
);

export const OfferedCourseRoutes = router;
