const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

/**
 * @route   PUT /api/admin/ip-applications/:id/status
 * @desc    Update IP application status and notify faculty
 * @access  Admin only
 */
router.put('/ip-applications/:id/status', adminController.updateApplicationStatus);

/**
 * @route   POST /api/admin/notifications/send
 * @desc    Send notification to a faculty member
 * @access  Admin only
 */
router.post('/notifications/send', adminController.sendFacultyNotification);

/**
 * @route   POST /api/admin/notifications/bulk-send
 * @desc    Send notification to multiple faculty members
 * @access  Admin only
 */
router.post('/notifications/bulk-send', adminController.bulkSendNotifications);

module.exports = router;
