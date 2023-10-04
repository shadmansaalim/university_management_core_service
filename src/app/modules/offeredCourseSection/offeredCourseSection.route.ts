// Imports
import express from 'express';
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
  OfferedCourseSectionController.createOfferedCourseSection
);

router.patch(
  '/:id',
  validateRequest(OfferedCourseSectionValidation.update),
  OfferedCourseSectionController.updateSingleOfferedCourseSection
);

router.delete(
  '/:id',
  OfferedCourseSectionController.deleteSingleOfferedCourseSection
);

export const OfferedCourseSectionRoutes = router;
