// Imports
import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import authGuard from '../../middlewares/authGuard';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseClassScheduleController } from './offeredCourseClassSchedule.controller';
import { OfferedCourseClassScheduleValidation } from './offeredCourseClassSchedule.validation';

// Express router
const router = express.Router();

// API Endpoints
router.get(
  '/:id',
  OfferedCourseClassScheduleController.getSingleOfferedCourseClassSchedule
);

router.get(
  '/',
  OfferedCourseClassScheduleController.getAllOfferedCourseClassSchedules
);

router.post(
  '/',
  validateRequest(OfferedCourseClassScheduleValidation.create),
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  OfferedCourseClassScheduleController.createOfferedCourseClassSchedule
);

router.patch(
  '/:id',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(OfferedCourseClassScheduleValidation.update),
  OfferedCourseClassScheduleController.updateSingleOfferedCourseClassSchedule
);

router.delete(
  '/:id',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  OfferedCourseClassScheduleController.deleteSingleOfferedCourseClassSchedule
);

export const OfferedCourseClassScheduleRoutes = router;
