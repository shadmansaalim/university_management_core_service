// Imports
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseController } from './offeredCourse.controller';
import { OfferedCourseValidation } from './offeredCourse.validation';

// Express router
const router = express.Router();

// API Endpoints
router.get('/:id', OfferedCourseController.getSingleOfferedCourse);

router.get('/', OfferedCourseController.getAllOfferedCourses);

router.post(
  '/create-offered-course',
  validateRequest(OfferedCourseValidation.createOfferedCourseZodSchema),
  OfferedCourseController.createOfferedCourse
);

router.patch(
  '/:id',
  // authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(OfferedCourseValidation.updateOfferedCourseZodSchema),
  OfferedCourseController.updateSingleOfferedCourse
);

router.delete(
  '/:id',
  // authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  OfferedCourseController.deleteSingleOfferedCourse
);

export const OfferedCourseRoutes = router;
