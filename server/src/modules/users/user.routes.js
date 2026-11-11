import { Router } from 'express';
import * as userController from './user.controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { validate } from '../../middlewares/validate.js';
import {
  updateProfileSchema,
  changePasswordSchema,
  savedPassengerSchema,
} from './user.schema.js';

const router = Router();

router.use(authenticate);

router.put('/profile', validate(updateProfileSchema), userController.updateProfile);
router.post('/change-password', validate(changePasswordSchema), userController.changePassword);

// Saved Passengers CRUD
router.get('/passengers', userController.getSavedPassengers);
router.post('/passengers', validate(savedPassengerSchema), userController.createSavedPassenger);
router.put('/passengers/:id', validate(savedPassengerSchema), userController.updateSavedPassenger);
router.delete('/passengers/:id', userController.deleteSavedPassenger);

export default router;
