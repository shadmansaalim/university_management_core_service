// Imports
import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import authGuard from '../../middlewares/authGuard';
import { StudentSemesterPaymentController } from './studentSemesterPayment.controller';

// Express router
const router = express.Router();

// API Endpoints

router.get(
  '/',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  StudentSemesterPaymentController.getAllStudentSemesterPayments
);

export const StudentSemesterPaymentRoutes = router;
