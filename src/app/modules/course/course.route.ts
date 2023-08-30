// Imports
import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import authGuard from '../../middlewares/authGuard';
import { CourseController } from './course.controller';

// Express router
const router = express.Router();

// API Endpoints

router.post(
  '/create-course',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  CourseController.createCourse
);

export const CourseRoutes = router;
