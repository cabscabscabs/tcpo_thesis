const express = require('express');
const router = express.Router();
const { authenticateUser, requireFacultyOrAdmin } = require('../middleware/auth');
const facultyController = require('../controllers/facultyController');

// All routes require authentication and faculty/admin role
router.use(authenticateUser);
router.use(requireFacultyOrAdmin);

/**
 * @route   GET /api/faculty/dashboard
 * @desc    Get faculty dashboard statistics
 * @access  Private (Faculty/Admin)
 */
router.get('/dashboard', facultyController.getDashboardStats);

/**
 * @route   POST /api/faculty/ip-applications
 * @desc    Create a new IP application
 * @access  Private (Faculty/Admin)
 */
router.post('/ip-applications', facultyController.createApplication);

/**
 * @route   GET /api/faculty/ip-applications
 * @desc    Get all applications for the faculty member
 * @access  Private (Faculty/Admin)
 * @query   status, ip_type, search, page, limit, sortBy, sortOrder
 */
router.get('/ip-applications', facultyController.getApplications);

/**
 * @route   GET /api/faculty/ip-applications/:id
 * @desc    Get a single application by ID
 * @access  Private (Faculty/Admin)
 */
router.get('/ip-applications/:id', facultyController.getApplication);

/**
 * @route   PUT /api/faculty/ip-applications/:id
 * @desc    Update an application
 * @access  Private (Faculty/Admin)
 */
router.put('/ip-applications/:id', facultyController.updateApplication);

/**
 * @route   POST /api/faculty/ip-applications/:id/submit
 * @desc    Submit an application for review
 * @access  Private (Faculty/Admin)
 */
router.post('/ip-applications/:id/submit', facultyController.submitApplication);

/**
 * @route   GET /api/faculty/ip-applications/:id/versions
 * @desc    Get version history for an application
 * @access  Private (Faculty/Admin)
 */
router.get('/ip-applications/:id/versions', facultyController.getVersions);

/**
 * @route   GET /api/faculty/notifications
 * @desc    Get faculty notifications
 * @access  Private (Faculty/Admin)
 * @query   page, limit, unreadOnly
 */
router.get('/notifications', facultyController.getNotifications);

/**
 * @route   PUT /api/faculty/notifications/:id/read
 * @desc    Mark a notification as read
 * @access  Private (Faculty/Admin)
 */
router.put('/notifications/:id/read', facultyController.markNotificationRead);

/**
 * @route   PUT /api/faculty/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private (Faculty/Admin)
 */
router.put('/notifications/read-all', facultyController.markAllNotificationsRead);

module.exports = router;
