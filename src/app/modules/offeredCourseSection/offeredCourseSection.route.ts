// Imports
import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import authGuard from '../../middlewares/authGuard';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseSectionController } from './offeredCourseSection.controller';
import { OfferedCourseSectionValidation } from './offeredCourseSection.validation';

// Express router
const router = express.Router();

// API Endpoints
router.get(
  '/:id',
  OfferedCourseSectionController.getSingleOfferedCourseSection
);

router.get('/', OfferedCourseSectionController.getAllOfferedCourseSections);

router.post(
  '/',
  validateRequest(OfferedCourseSectionValidation.create),
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  OfferedCourseSectionController.createOfferedCourseSection
);

router.patch(
  '/:id',
  validateRequest(OfferedCourseSectionValidation.update),
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  OfferedCourseSectionController.updateSingleOfferedCourseSection
);

router.delete(
  '/:id',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  OfferedCourseSectionController.deleteSingleOfferedCourseSection
);

export const OfferedCourseSectionRoutes = router;
