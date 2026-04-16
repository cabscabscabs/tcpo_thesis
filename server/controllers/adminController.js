const { supabase } = require('../middleware/auth');
const emailService = require('../services/emailService');

/**
 * Update IP application status (Admin only)
 * @route   PUT /api/admin/ip-applications/:id/status
 * @desc    Update application status and notify faculty
 */
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const adminId = req.user.id;

    // Validate status
    const validStatuses = [
      'Draft',
      'Submitted for Internal Review',
      'Under Internal Review',
      'Needs Revision',
      'Approved for IPOPHL Filing',
      'Filed to IPOPHL',
      'Under IPOPHL Examination',
      'Granted',
      'Rejected'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status',
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Get current application with faculty info
    const { data: currentApp, error: fetchError } = await supabase
      .from('ip_applications')
      .select(`
        *,
        faculty:faculty_id (
          id,
          email,
          full_name
        )
      `)
      .eq('id', id)
      .single();

    if (fetchError || !currentApp) {
      return res.status(404).json({
        error: 'Application not found',
        message: 'The requested application does not exist'
      });
    }

    const oldStatus = currentApp.status;

    // Update application status
    const { data: updatedApp, error: updateError } = await supabase
      .from('ip_applications')
      .update({
        status,
        admin_notes: notes || currentApp.admin_notes,
        updated_at: new Date().toISOString(),
        status_updated_at: new Date().toISOString(),
        status_updated_by: adminId
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating application status:', updateError);
      return res.status(500).json({
        error: 'Failed to update status',
        message: updateError.message
      });
    }

    // Create notification for faculty
    const notificationTitle = `Application Status Updated: ${status}`;
    const notificationMessage = `Your IP application "${currentApp.title}" status has been changed from "${oldStatus}" to "${status}".${notes ? ` Notes: ${notes}` : ''}`;

    const { error: notificationError } = await supabase
      .from('faculty_notifications')
      .insert({
        faculty_id: currentApp.faculty_id,
        application_id: id,
        title: notificationTitle,
        message: notificationMessage,
        type: 'status_update',
        is_read: false,
        created_at: new Date().toISOString()
      });

    if (notificationError) {
      console.error('Error creating notification:', notificationError);
    }

    // Send email notification to faculty
    let emailResult = null;
    if (currentApp.faculty && currentApp.faculty.email) {
      emailResult = await emailService.sendStatusUpdateEmail(
        currentApp.faculty.email,
        currentApp,
        oldStatus,
        status
      );
      
      if (!emailResult.success) {
        console.error('Failed to send email:', emailResult.error);
      }
    }

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        user_id: adminId,
        action: 'status_update',
        entity_type: 'ip_application',
        entity_id: id,
        details: {
          old_status: oldStatus,
          new_status: status,
          notes: notes || null
        },
        created_at: new Date().toISOString()
      });

    return res.json({
      success: true,
      message: 'Application status updated successfully',
      data: updatedApp,
      notification: {
        title: notificationTitle,
        message: notificationMessage
      },
      email: emailResult ? {
        sent: emailResult.success,
        error: emailResult.error || null
      } : null
    });

  } catch (error) {
    console.error('Error in updateApplicationStatus:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Send custom notification to faculty
 * @route   POST /api/admin/notifications/send
 * @desc    Send notification and email to faculty
 */
const sendFacultyNotification = async (req, res) => {
  try {
    const { facultyId, title, message, applicationId, actionUrl, actionText } = req.body;
    const adminId = req.user.id;

    // Validate required fields
    if (!facultyId || !title || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'facultyId, title, and message are required'
      });
    }

    // Get faculty email
    const { data: faculty, error: facultyError } = await supabase
      .from('faculty_profiles')
      .select('email, full_name')
      .eq('id', facultyId)
      .single();

    if (facultyError || !faculty) {
      return res.status(404).json({
        error: 'Faculty not found',
        message: 'The specified faculty member does not exist'
      });
    }

    // Create notification in database
    const { data: notification, error: notificationError } = await supabase
      .from('faculty_notifications')
      .insert({
        faculty_id: facultyId,
        application_id: applicationId || null,
        title,
        message,
        type: 'admin_message',
        is_read: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (notificationError) {
      console.error('Error creating notification:', notificationError);
      return res.status(500).json({
        error: 'Failed to create notification',
        message: notificationError.message
      });
    }

    // Send email notification
    const emailResult = await emailService.sendNotificationEmail(
      faculty.email,
      {
        title,
        message,
        action_url: actionUrl,
        action_text: actionText
      }
    );

    if (!emailResult.success) {
      console.error('Failed to send email:', emailResult.error);
    }

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        user_id: adminId,
        action: 'send_notification',
        entity_type: 'faculty',
        entity_id: facultyId,
        details: {
          notification_id: notification.id,
          title,
          email_sent: emailResult.success
        },
        created_at: new Date().toISOString()
      });

    return res.json({
      success: true,
      message: 'Notification sent successfully',
      data: notification,
      email: {
        sent: emailResult.success,
        error: emailResult.error || null
      }
    });

  } catch (error) {
    console.error('Error in sendFacultyNotification:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Bulk send notifications to multiple faculty
 * @route   POST /api/admin/notifications/bulk-send
 * @desc    Send notification to multiple faculty members
 */
const bulkSendNotifications = async (req, res) => {
  try {
    const { facultyIds, title, message, actionUrl, actionText } = req.body;
    const adminId = req.user.id;

    if (!facultyIds || !Array.isArray(facultyIds) || facultyIds.length === 0 || !title || !message) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'facultyIds (array), title, and message are required'
      });
    }

    // Get faculty emails
    const { data: facultyList, error: facultyError } = await supabase
      .from('faculty_profiles')
      .select('id, email, full_name')
      .in('id', facultyIds);

    if (facultyError) {
      return res.status(500).json({
        error: 'Failed to fetch faculty',
        message: facultyError.message
      });
    }

    const results = [];
    const errors = [];

    // Send to each faculty
    for (const faculty of facultyList) {
      try {
        // Create notification
        const { data: notification } = await supabase
          .from('faculty_notifications')
          .insert({
            faculty_id: faculty.id,
            title,
            message,
            type: 'admin_broadcast',
            is_read: false,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        // Send email
        const emailResult = await emailService.sendNotificationEmail(
          faculty.email,
          {
            title,
            message,
            action_url: actionUrl,
            action_text: actionText
          }
        );

        results.push({
          facultyId: faculty.id,
          notificationId: notification?.id,
          emailSent: emailResult.success
        });

      } catch (err) {
        errors.push({
          facultyId: faculty.id,
          error: err.message
        });
      }
    }

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({
        user_id: adminId,
        action: 'bulk_notification',
        entity_type: 'faculty',
        details: {
          recipient_count: facultyIds.length,
          success_count: results.length,
          error_count: errors.length,
          title
        },
        created_at: new Date().toISOString()
      });

    return res.json({
      success: true,
      message: `Notifications sent to ${results.length} faculty members`,
      data: {
        total: facultyIds.length,
        sent: results.length,
        errors: errors.length
      },
      results,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error in bulkSendNotifications:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

module.exports = {
  updateApplicationStatus,
  sendFacultyNotification,
  bulkSendNotifications
};
