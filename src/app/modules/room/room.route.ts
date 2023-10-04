// Imports
import express from 'express';
import { ENUM_USER_ROLES } from '../../../enums/user';
import authGuard from '../../middlewares/authGuard';
import validateRequest from '../../middlewares/validateRequest';
import { RoomController } from './room.controller';
import { RoomValidation } from './room.validation';

// Express router
const router = express.Router();

// API Endpoints
router.get('/:id', RoomController.getSingleRoom);

router.get('/', RoomController.getAllRooms);

router.post(
  '/',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(RoomValidation.create),
  RoomController.createRoom
);

router.patch(
  '/:id',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  validateRequest(RoomValidation.update),
  RoomController.updateSingleRoom
);

router.delete(
  '/:id',
  authGuard(ENUM_USER_ROLES.ADMIN, ENUM_USER_ROLES.SUPER_ADMIN),
  RoomController.deleteSingleRoom
);

export const RoomRoutes = router;
