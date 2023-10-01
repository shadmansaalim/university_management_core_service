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
  '/create-offered-course-section',
  validateRequest(
    OfferedCourseSectionValidation.createOfferedCourseSectionZodSchema
  ),
  OfferedCourseSectionController.createOfferedCourseSection
);

router.patch(
  '/:id',
  validateRequest(
    OfferedCourseSectionValidation.updateOfferedCourseSectionZodSchema
  ),
  OfferedCourseSectionController.updateSingleOfferedCourseSection
);

router.delete(
  '/:id',
  OfferedCourseSectionController.deleteSingleOfferedCourseSection
);

export const OfferedCourseSectionRoutes = router;
