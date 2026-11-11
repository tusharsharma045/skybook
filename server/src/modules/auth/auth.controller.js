import * as authService from './auth.service.js';
import { sendSuccess } from '../../utils/response.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.registerUser(req.body);

  res.cookie(authService.REFRESH_COOKIE_NAME, refreshToken, authService.getCookieOptions());

  return sendSuccess(res, 201, 'Account created successfully', {
    user,
    accessToken,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.loginUser(req.body);

  res.cookie(authService.REFRESH_COOKIE_NAME, refreshToken, authService.getCookieOptions());

  return sendSuccess(res, 200, 'Logged in successfully', {
    user,
    accessToken,
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const rawRefreshToken = req.cookies[authService.REFRESH_COOKIE_NAME] || req.body.refreshToken;

  const { user, accessToken, refreshToken } = await authService.refreshTokens(rawRefreshToken);

  res.cookie(authService.REFRESH_COOKIE_NAME, refreshToken, authService.getCookieOptions());

  return sendSuccess(res, 200, 'Token refreshed successfully', {
    user,
    accessToken,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const rawRefreshToken = req.cookies[authService.REFRESH_COOKIE_NAME];
  await authService.logoutUser(rawRefreshToken);

  res.clearCookie(authService.REFRESH_COOKIE_NAME, {
    ...authService.getCookieOptions(),
    maxAge: 0,
  });

  return sendSuccess(res, 200, 'Logged out successfully');
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUserProfile(req.user.id);
  return sendSuccess(res, 200, 'Profile fetched successfully', { user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.requestPasswordReset(req.body.email);
  return sendSuccess(res, 200, result.message, { previewCode: result.previewCode });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPasswordWithCode(req.body);
  return sendSuccess(res, 200, result.message);
});
