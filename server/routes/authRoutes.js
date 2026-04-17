const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateUser, requireFacultyOrAdmin } = require('../middleware/auth');
const { 
  loginLimiter, 
  passwordResetLimiter, 
  apiLimiter,
  generateCSRFToken 
} = require('../middleware/security');

/**
 * @route   GET /api/auth/csrf-token
 * @desc    Get CSRF token
 * @access  Public
 */
router.get('/csrf-token', generateCSRFToken, authController.getCSRFToken);

/**
 * @route   POST /api/auth/login
 * @desc    Login with email/password
 * @access  Public
 */
router.post('/login', loginLimiter, authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout current session
 * @access  Private
 */
router.post('/logout', authenticateUser, authController.logout);

/**
 * @route   POST /api/auth/logout-all
 * @desc    Logout from all devices
 * @access  Private
 */
router.post('/logout-all', authenticateUser, authController.logoutAll);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public (with refresh token)
 */
router.post('/refresh', apiLimiter, authController.refreshTokens);

/**
 * @route   GET /api/auth/sessions
 * @desc    Get all active sessions
 * @access  Private
 */
router.get('/sessions', authenticateUser, authController.getSessions);

/**
 * @route   POST /api/auth/password-reset/request
 * @desc    Request password reset email
 * @access  Public
 */
router.post('/password-reset/request', passwordResetLimiter, authController.requestPasswordReset);

/**
 * @route   POST /api/auth/password-reset/confirm
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/password-reset/confirm', passwordResetLimiter, authController.resetPassword);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change password (authenticated)
 * @access  Private
 */
router.post('/change-password', authenticateUser, authController.changePassword);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 */
router.post('/verify-email', authController.verifyEmail);

module.exports = router;
