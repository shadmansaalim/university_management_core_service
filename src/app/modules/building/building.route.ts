// Imports
import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import authGuard from '../../middlewares/authGuard';
import validateRequest from '../../middlewares/validateRequest';
import { BuildingController } from './building.controller';
import { BuildingValidation } from './building.validation';

// Express router
const router = express.Router();

// API Endpoints
router.get('/:id', BuildingController.getSingleBuilding);

router.get('/', BuildingController.getAllBuildings);

router.post(
  '/',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(BuildingValidation.create),
  BuildingController.createBuilding
);

router.patch(
  '/:id',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(BuildingValidation.update),
  BuildingController.updateSingleBuilding
);

router.delete(
  '/:id',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  BuildingController.deleteSingleBuilding
);

export const BuildingRoutes = router;
