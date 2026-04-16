const { supabase } = require('../middleware/auth');
const {
  validateApplication,
  validateApplicationUpdate,
  validateFileUpload,
  sanitizeApplicationData
} = require('../validators/ipApplicationValidator');

/**
 * Create a new IP application
 */
const createApplication = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const isDraft = req.body.saveAsDraft === true;
    
    // Sanitize input data
    const sanitizedData = sanitizeApplicationData(req.body);
    
    // Validate data
    const validation = validateApplication(sanitizedData, isDraft);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      });
    }

    // Prepare application data
    const applicationData = {
      faculty_id: facultyId,
      ip_type: sanitizedData.ip_type,
      status: isDraft ? 'Draft' : 'Draft', // Always start as Draft, submit separately
      
      // Applicant info
      applicant_full_name: sanitizedData.applicant_full_name,
      applicant_address: sanitizedData.applicant_address,
      applicant_nationality: sanitizedData.applicant_nationality,
      applicant_email: sanitizedData.applicant_email,
      applicant_phone: sanitizedData.applicant_phone,
      
      // Invention details
      title: sanitizedData.title,
      abstract: sanitizedData.abstract,
      field_of_technology: sanitizedData.field_of_technology,
      background_of_invention: sanitizedData.background_of_invention,
      detailed_description: sanitizedData.detailed_description,
      summary_of_invention: sanitizedData.summary_of_invention,
      
      // Co-inventors
      co_inventors: sanitizedData.co_inventors || '[]',
      
      // Declaration
      declaration_confirmed: sanitizedData.declaration_confirmed,
      declaration_date: sanitizedData.declaration_confirmed ? new Date().toISOString() : null
    };

    // Insert application
    const { data: application, error } = await supabase
      .from('ip_applications')
      .insert([applicationData])
      .select()
      .single();

    if (error) {
      console.error('Error creating application:', error);
      return res.status(500).json({
        error: 'Failed to create application',
        message: error.message
      });
    }

    // Insert claims if provided (for Patent and Utility Model)
    if (sanitizedData.claims && ['Patent', 'Utility Model'].includes(sanitizedData.ip_type)) {
      const claimsData = sanitizedData.claims.map(claim => ({
        application_id: application.id,
        claim_number: claim.claim_number,
        claim_type: claim.claim_type,
        claim_text: claim.claim_text,
        depends_on: claim.depends_on
      }));

      const { error: claimsError } = await supabase
        .from('ip_application_claims')
        .insert(claimsData);

      if (claimsError) {
        console.error('Error creating claims:', claimsError);
      }
    }

    // If not draft, submit immediately
    if (!isDraft) {
      await submitApplicationInternal(application.id, facultyId);
    }

    return res.status(201).json({
      success: true,
      message: isDraft ? 'Application saved as draft' : 'Application created and submitted',
      data: application
    });

  } catch (error) {
    console.error('Error in createApplication:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Get all applications for the faculty member
 */
const getApplications = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { 
      status, 
      ip_type, 
      search, 
      page = 1, 
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = supabase
      .from('ip_applications')
      .select('*', { count: 'exact' })
      .eq('faculty_id', facultyId)
      .eq('is_archived', false);

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (ip_type) {
      query = query.eq('ip_type', ip_type);
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,application_number.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching applications:', error);
      return res.status(500).json({
        error: 'Failed to fetch applications',
        message: error.message
      });
    }

    return res.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Error in getApplications:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Get a single application by ID
 */
const getApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const facultyId = req.user.id;

    // Get application
    const { data: application, error } = await supabase
      .from('ip_applications')
      .select('*')
      .eq('id', id)
      .eq('faculty_id', facultyId)
      .single();

    if (error || !application) {
      return res.status(404).json({
        error: 'Application not found',
        message: 'The requested application does not exist or you do not have access'
      });
    }

    // Get claims
    const { data: claims } = await supabase
      .from('ip_application_claims')
      .select('*')
      .eq('application_id', id)
      .order('claim_number', { ascending: true });

    // Get attachments
    const { data: attachments } = await supabase
      .from('ip_application_attachments')
      .select('*')
      .eq('application_id', id);

    // Get status history
    const { data: statusHistory } = await supabase
      .from('ip_application_status_history')
      .select('*')
      .eq('application_id', id)
      .order('created_at', { ascending: false });

    // Get comments
    const { data: comments } = await supabase
      .from('ip_application_comments')
      .select('*')
      .eq('application_id', id)
      .order('created_at', { ascending: false });

    return res.json({
      success: true,
      data: {
        ...application,
        claims: claims || [],
        attachments: attachments || [],
        statusHistory: statusHistory || [],
        comments: comments || []
      }
    });

  } catch (error) {
    console.error('Error in getApplication:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Update an application
 */
const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const facultyId = req.user.id;

    // Get current application
    const { data: currentApp, error: fetchError } = await supabase
      .from('ip_applications')
      .select('*')
      .eq('id', id)
      .eq('faculty_id', facultyId)
      .single();

    if (fetchError || !currentApp) {
      return res.status(404).json({
        error: 'Application not found',
        message: 'The requested application does not exist or you do not have access'
      });
    }

    // Check if update is allowed
    const editableStatuses = ['Draft', 'Needs Revision'];
    if (!editableStatuses.includes(currentApp.status)) {
      return res.status(403).json({
        error: 'Cannot edit application',
        message: `Applications with status '${currentApp.status}' cannot be edited`
      });
    }

    // Sanitize and validate data
    const sanitizedData = sanitizeApplicationData(req.body);
    const isDraft = req.body.saveAsDraft === true || currentApp.status === 'Draft';
    
    const validation = validateApplicationUpdate(sanitizedData, currentApp.status);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      });
    }

    // Prepare update data
    const updateData = {
      ip_type: sanitizedData.ip_type || currentApp.ip_type,
      applicant_full_name: sanitizedData.applicant_full_name || currentApp.applicant_full_name,
      applicant_address: sanitizedData.applicant_address || currentApp.applicant_address,
      applicant_nationality: sanitizedData.applicant_nationality || currentApp.applicant_nationality,
      applicant_email: sanitizedData.applicant_email || currentApp.applicant_email,
      applicant_phone: sanitizedData.applicant_phone || currentApp.applicant_phone,
      title: sanitizedData.title || currentApp.title,
      abstract: sanitizedData.abstract || currentApp.abstract,
      field_of_technology: sanitizedData.field_of_technology || currentApp.field_of_technology,
      background_of_invention: sanitizedData.background_of_invention || currentApp.background_of_invention,
      detailed_description: sanitizedData.detailed_description || currentApp.detailed_description,
      summary_of_invention: sanitizedData.summary_of_invention || currentApp.summary_of_invention,
      co_inventors: sanitizedData.co_inventors || currentApp.co_inventors,
      declaration_confirmed: sanitizedData.declaration_confirmed,
      declaration_date: sanitizedData.declaration_confirmed ? new Date().toISOString() : currentApp.declaration_date,
      updated_at: new Date().toISOString()
    };

    // Update application
    const { data: updatedApp, error: updateError } = await supabase
      .from('ip_applications')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating application:', updateError);
      return res.status(500).json({
        error: 'Failed to update application',
        message: updateError.message
      });
    }

    // Update claims if provided
    if (sanitizedData.claims && ['Patent', 'Utility Model'].includes(sanitizedData.ip_type)) {
      // Delete existing claims
      await supabase
        .from('ip_application_claims')
        .delete()
        .eq('application_id', id);

      // Insert new claims
      const claimsData = sanitizedData.claims.map(claim => ({
        application_id: id,
        claim_number: claim.claim_number,
        claim_type: claim.claim_type,
        claim_text: claim.claim_text,
        depends_on: claim.depends_on
      }));

      await supabase
        .from('ip_application_claims')
        .insert(claimsData);
    }

    // Create new version
    await createNewVersion(id, facultyId, 'manual_save', req.body.changeSummary || 'Application updated');

    return res.json({
      success: true,
      message: 'Application updated successfully',
      data: updatedApp
    });

  } catch (error) {
    console.error('Error in updateApplication:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Submit an application for review
 */
const submitApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const facultyId = req.user.id;

    const result = await submitApplicationInternal(id, facultyId);
    
    if (result.error) {
      return res.status(result.status || 400).json(result);
    }

    return res.json(result);

  } catch (error) {
    console.error('Error in submitApplication:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Internal function to submit an application
 */
const submitApplicationInternal = async (applicationId, facultyId) => {
  try {
    // Get current application
    const { data: currentApp, error: fetchError } = await supabase
      .from('ip_applications')
      .select('*')
      .eq('id', applicationId)
      .eq('faculty_id', facultyId)
      .single();

    if (fetchError || !currentApp) {
      return { error: true, status: 404, message: 'Application not found' };
    }

    // Check if already submitted
    if (currentApp.status !== 'Draft' && currentApp.status !== 'Needs Revision') {
      return { 
        error: true, 
        status: 400, 
        message: `Application already submitted with status: ${currentApp.status}` 
      };
    }

    // Validate complete data before submission
    const validation = validateApplication(currentApp, false);
    if (!validation.isValid) {
      return { 
        error: true, 
        status: 400, 
        message: 'Application is incomplete',
        details: validation.errors 
      };
    }

    // Update status
    const { data: updatedApp, error: updateError } = await supabase
      .from('ip_applications')
      .update({
        status: 'Submitted for Internal Review',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', applicationId)
      .select()
      .single();

    if (updateError) {
      return { 
        error: true, 
        status: 500, 
        message: 'Failed to submit application' 
      };
    }

    return {
      success: true,
      message: 'Application submitted for review',
      data: updatedApp
    };

  } catch (error) {
    return { 
      error: true, 
      status: 500, 
      message: error.message 
    };
  }
};

/**
 * Get version history for an application
 */
const getVersions = async (req, res) => {
  try {
    const { id } = req.params;
    const facultyId = req.user.id;

    // Verify ownership
    const { data: app, error: appError } = await supabase
      .from('ip_applications')
      .select('id')
      .eq('id', id)
      .eq('faculty_id', facultyId)
      .single();

    if (appError || !app) {
      return res.status(404).json({
        error: 'Application not found',
        message: 'The requested application does not exist or you do not have access'
      });
    }

    const { data: versions, error } = await supabase
      .from('ip_application_versions')
      .select('*')
      .eq('application_id', id)
      .order('version_number', { ascending: false });

    if (error) {
      return res.status(500).json({
        error: 'Failed to fetch versions',
        message: error.message
      });
    }

    return res.json({
      success: true,
      data: versions
    });

  } catch (error) {
    console.error('Error in getVersions:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Create a new version
 */
const createNewVersion = async (applicationId, facultyId, changeType = 'manual_save', changeSummary = '') => {
  try {
    // Get current application data
    const { data: app } = await supabase
      .from('ip_applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (!app) return;

    // Get next version number
    const { data: lastVersion } = await supabase
      .from('ip_application_versions')
      .select('version_number')
      .eq('application_id', applicationId)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();

    const nextVersion = (lastVersion?.version_number || 0) + 1;

    // Insert new version
    await supabase
      .from('ip_application_versions')
      .insert([{
        application_id: applicationId,
        version_number: nextVersion,
        title: app.title,
        abstract: app.abstract,
        field_of_technology: app.field_of_technology,
        background_of_invention: app.background_of_invention,
        detailed_description: app.detailed_description,
        summary_of_invention: app.summary_of_invention,
        co_inventors: app.co_inventors,
        change_summary: changeSummary,
        changed_by: facultyId,
        change_type: changeType
      }]);

    // Update current version on application
    await supabase
      .from('ip_applications')
      .update({ current_version: nextVersion })
      .eq('id', applicationId);

  } catch (error) {
    console.error('Error creating version:', error);
  }
};

/**
 * Get faculty notifications
 */
const getNotifications = async (req, res) => {
  try {
    const facultyId = req.user.id;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    let query = supabase
      .from('faculty_notifications')
      .select('*', { count: 'exact' })
      .eq('faculty_id', facultyId);

    if (unreadOnly === 'true') {
      query = query.eq('is_read', false);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      return res.status(500).json({
        error: 'Failed to fetch notifications',
        message: error.message
      });
    }

    return res.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count
      }
    });

  } catch (error) {
    console.error('Error in getNotifications:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Mark notification as read
 */
const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const facultyId = req.user.id;

    const { data, error } = await supabase
      .from('faculty_notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('faculty_id', facultyId)
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: 'Failed to update notification',
        message: error.message
      });
    }

    return res.json({
      success: true,
      message: 'Notification marked as read',
      data
    });

  } catch (error) {
    console.error('Error in markNotificationRead:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Mark all notifications as read
 */
const markAllNotificationsRead = async (req, res) => {
  try {
    const facultyId = req.user.id;

    const { error } = await supabase
      .from('faculty_notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('faculty_id', facultyId)
      .eq('is_read', false);

    if (error) {
      return res.status(500).json({
        error: 'Failed to update notifications',
        message: error.message
      });
    }

    return res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Error in markAllNotificationsRead:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

/**
 * Get dashboard statistics for faculty
 */
const getDashboardStats = async (req, res) => {
  try {
    const facultyId = req.user.id;

    // Get counts by status
    const { data: statusCounts, error } = await supabase
      .from('ip_applications')
      .select('status')
      .eq('faculty_id', facultyId)
      .eq('is_archived', false);

    if (error) {
      return res.status(500).json({
        error: 'Failed to fetch statistics',
        message: error.message
      });
    }

    // Calculate stats
    const stats = {
      total: statusCounts.length,
      draft: statusCounts.filter(a => a.status === 'Draft').length,
      submitted: statusCounts.filter(a => a.status === 'Submitted for Internal Review').length,
      needsRevision: statusCounts.filter(a => a.status === 'Needs Revision').length,
      approved: statusCounts.filter(a => a.status === 'Approved for IPOPHL Filing').length,
      filed: statusCounts.filter(a => a.status === 'Filed to IPOPHL').length,
      underExamination: statusCounts.filter(a => a.status === 'Under IPOPHL Examination').length,
      granted: statusCounts.filter(a => a.status === 'Granted').length,
      rejected: statusCounts.filter(a => a.status === 'Rejected').length
    };

    // Get unread notifications count
    const { count: unreadNotifications } = await supabase
      .from('faculty_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('faculty_id', facultyId)
      .eq('is_read', false);

    return res.json({
      success: true,
      data: {
        applications: stats,
        unreadNotifications: unreadNotifications || 0
      }
    });

  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  submitApplication,
  getVersions,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getDashboardStats
};
