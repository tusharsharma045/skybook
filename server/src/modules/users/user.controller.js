import * as userService from './user.service.js';
import { sendSuccess } from '../../utils/response.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  return sendSuccess(res, 200, 'Profile updated successfully', { user });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await userService.changePassword(req.user.id, currentPassword, newPassword);
  return sendSuccess(res, 200, result.message);
});

export const getSavedPassengers = asyncHandler(async (req, res) => {
  const passengers = await userService.getSavedPassengers(req.user.id);
  return sendSuccess(res, 200, 'Saved passengers retrieved', { passengers });
});

export const createSavedPassenger = asyncHandler(async (req, res) => {
  const passenger = await userService.createSavedPassenger(req.user.id, req.body);
  return sendSuccess(res, 201, 'Passenger saved to profile', { passenger });
});

export const updateSavedPassenger = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const passenger = await userService.updateSavedPassenger(id, req.user.id, req.body);
  return sendSuccess(res, 200, 'Passenger updated', { passenger });
});

export const deleteSavedPassenger = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await userService.deleteSavedPassenger(id, req.user.id);
  return sendSuccess(res, 200, result.message);
});
