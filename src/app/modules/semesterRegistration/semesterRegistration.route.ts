// Imports
import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import authGuard from '../../middlewares/authGuard';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationValidation } from './semesterRegistration.validation';

// Express router
const router = express.Router();

// API Endpoints
router.get(
  '/get-my-registration',
  authGuard(ENUM_USER_ROLES.STUDENT),
  SemesterRegistrationController.getMyRegistration
);

router.get(
  '/:id',
  SemesterRegistrationController.getSingleSemesterRegistration
);

router.get('/', SemesterRegistrationController.getAllSemesterRegistrations);

router.post(
  '/',
  validateRequest(SemesterRegistrationValidation.create),
  SemesterRegistrationController.createSemesterRegistration
);

router.patch(
  '/:id',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(SemesterRegistrationValidation.update),
  SemesterRegistrationController.updateSingleSemesterRegistration
);

router.delete(
  '/:id',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  SemesterRegistrationController.deleteSingleSemesterRegistration
);

router.post(
  '/start-registration',
  authGuard(ENUM_USER_ROLES.STUDENT),
  SemesterRegistrationController.startMyRegistration
);

router.post(
  '/enroll-into-course',
  authGuard(ENUM_USER_ROLES.STUDENT),
  validateRequest(SemesterRegistrationValidation.enrollOrWithdrawCourse),
  SemesterRegistrationController.enrollIntoCourse
);

router.post(
  '/withdraw-from-course',
  authGuard(ENUM_USER_ROLES.STUDENT),
  validateRequest(SemesterRegistrationValidation.enrollOrWithdrawCourse),
  SemesterRegistrationController.withdrawFromCourse
);

router.post(
  '/confirm-my-registration',
  authGuard(ENUM_USER_ROLES.STUDENT),
  SemesterRegistrationController.confirmMyRegistration
);

export const SemesterRegistrationRoutes = router;
