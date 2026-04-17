const { supabase } = require('../middleware/auth');
const AuthService = require('../services/authService');
const SecurityUtils = require('../utils/security');

/**
 * Authentication Controller
 */

/**
 * Login with email/password
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const clientIP = SecurityUtils.getClientIP(req);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    // Check email format
    if (!SecurityUtils.isValidEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (userError || !user) {
      // Log failed attempt
      await AuthService.createAuditLog('LOGIN_FAILED', {
        email,
        reason: 'user_not_found',
        ip: clientIP
      }, req);

      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check if account is locked
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return res.status(423).json({
        error: 'Account locked',
        message: 'Account is temporarily locked. Please try again later.'
      });
    }

    // Check if user has a password hash (for local auth)
    if (!user.password_hash) {
      // This user might use OAuth only
      return res.status(400).json({
        error: 'OAuth account',
        message: 'Please sign in with your social account'
      });
    }

    // Compare password
    const isPasswordValid = await AuthService.comparePassword(password, user.password_hash);
    
    if (!isPasswordValid) {
      // Increment failed attempts
      const failedAttempts = (user.failed_login_attempts || 0) + 1;
      
      await supabase
        .from('user_profiles')
        .update({
          failed_login_attempts: failedAttempts,
          locked_until: failedAttempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000).toISOString() : null
        })
        .eq('id', user.id);

      await AuthService.createAuditLog('LOGIN_FAILED', {
        userId: user.id,
        email,
        reason: 'invalid_password',
        attempts: failedAttempts,
        ip: clientIP
      }, req);

      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check if account is active
    if (user.status === 'inactive' || user.status === 'suspended') {
      return res.status(403).json({
        error: 'Account inactive',
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Check if email is verified (if verification is required)
    if (process.env.REQUIRE_EMAIL_VERIFICATION === 'true' && !user.email_verified) {
      return res.status(403).json({
        error: 'Email not verified',
        message: 'Please verify your email address before logging in.'
      });
    }

    // Generate tokens
    const tokens = AuthService.generateTokenPair(user);

    // Create session
    const session = await AuthService.createSession(user.id, req, {
      email: user.email,
      role: user.role
    });

    // Reset failed attempts and update last login
    await supabase
      .from('user_profiles')
      .update({
        failed_login_attempts: 0,
        locked_until: null,
        last_login_at: new Date().toISOString(),
        last_login_ip: clientIP
      })
      .eq('id', user.id);

    // Create audit log
    await AuthService.createAuditLog('LOGIN_SUCCESS', {
      userId: user.id,
      email: user.email,
      sessionId: session.sessionId,
      ip: clientIP
    }, req);

    // Set session cookie
    req.session.userId = user.id;
    req.session.role = user.role;
    req.session.email = user.email;

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      },
      tokens,
      sessionId: session.sessionId
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred during login'
    });
  }
};

/**
 * Logout
 * POST /api/auth/logout
 */
const logout = async (req, res) => {
  try {
    const sessionId = req.sessionID || req.headers['x-session-id'];

    if (sessionId) {
      await AuthService.destroySession(sessionId);
    }

    // Destroy session
    req.session?.destroy?.(() => {});

    await AuthService.createAuditLog('LOGOUT', {
      userId: req.user?.id,
      sessionId
    }, req);

    res.clearCookie('ustp-tpco.sid');
    res.clearCookie('XSRF-TOKEN');

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred during logout'
    });
  }
};

/**
 * Logout from all devices
 * POST /api/auth/logout-all
 */
const logoutAll = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const count = await AuthService.logoutAllDevices(userId);

    await AuthService.createAuditLog('LOGOUT_ALL_DEVICES', {
      userId,
      sessionsTerminated: count
    }, req);

    res.json({
      success: true,
      message: `Logged out from ${count} devices`
    });

  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred'
    });
  }
};

/**
 * Refresh tokens
 * POST /api/auth/refresh
 */
const refreshTokens = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: 'Missing refresh token',
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = AuthService.verifyToken(refreshToken);
    
    if (decoded.error || decoded.expired || decoded.invalid) {
      return res.status(401).json({
        error: 'Invalid refresh token',
        message: 'Please log in again'
      });
    }

    if (decoded.type !== 'refresh') {
      return res.status(401).json({
        error: 'Invalid token type',
        message: 'Please provide a valid refresh token'
      });
    }

    // Get user
    const { data: user, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', decoded.userId)
      .single();

    if (error || !user) {
      return res.status(401).json({
        error: 'User not found',
        message: 'Please log in again'
      });
    }

    // Generate new tokens
    const tokens = AuthService.generateTokenPair(user);

    // Create new session
    const session = await AuthService.createSession(user.id, req, {
      email: user.email,
      role: user.role
    });

    res.json({
      success: true,
      tokens,
      sessionId: session.sessionId
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred'
    });
  }
};

/**
 * Get current user sessions
 * GET /api/auth/sessions
 */
const getSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const sessions = await AuthService.getUserSessions(userId);

    // Format sessions for response
    const formattedSessions = sessions.map(s => ({
      sessionId: s.sessionId.substring(0, 8) + '...', // Mask session ID
      userAgent: s.userAgent,
      ip: s.ip,
      createdAt: s.createdAt,
      lastActivity: s.lastActivity,
      isCurrent: s.sessionId === req.sessionID
    }));

    res.json({
      success: true,
      sessions: formattedSessions
    });

  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred'
    });
  }
};

/**
 * Request password reset
 * POST /api/auth/password-reset/request
 */
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !SecurityUtils.isValidEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'Please provide a valid email address'
      });
    }

    // Check if user exists
    const { data: user, error } = await supabase
      .from('user_profiles')
      .select('id, email, full_name')
      .eq('email', email.toLowerCase())
      .single();

    // Always return success to prevent email enumeration
    if (error || !user) {
      return res.json({
        success: true,
        message: 'If an account exists, you will receive a password reset email'
      });
    }

    // Generate reset token
    const { token, hashedToken, expires } = AuthService.generatePasswordResetToken();

    // Store reset token
    await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: user.id,
        token: hashedToken,
        expires_at: expires.toISOString(),
        created_at: new Date().toISOString()
      });

    // Send email with reset link
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    // TODO: Send email via emailService
    console.log(`Password reset link: ${resetUrl}`);

    await AuthService.createAuditLog('PASSWORD_RESET_REQUESTED', {
      userId: user.id,
      email: user.email,
      ip: SecurityUtils.getClientIP(req)
    }, req);

    res.json({
      success: true,
      message: 'If an account exists, you will receive a password reset email'
    });

  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred'
    });
  }
};

/**
 * Reset password with token
 * POST /api/auth/password-reset/confirm
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        error: 'Missing fields',
        message: 'All fields are required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: 'Passwords do not match',
        message: 'Please ensure both passwords match'
      });
    }

    // Validate password strength
    const passwordValidation = AuthService.validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Weak password',
        message: passwordValidation.feedback.join('. ')
      });
    }

    // Hash the provided token
    const hashedToken = AuthService.hashResetToken(token);

    // Find valid reset token
    const { data: resetToken, error } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('token', hashedToken)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !resetToken) {
      return res.status(400).json({
        error: 'Invalid or expired token',
        message: 'Please request a new password reset link'
      });
    }

    // Hash new password
    const passwordHash = await AuthService.hashPassword(newPassword);

    // Update password
    await supabase
      .from('user_profiles')
      .update({
        password_hash: passwordHash,
        password_changed_at: new Date().toISOString()
      })
      .eq('id', resetToken.user_id);

    // Delete used reset token
    await supabase
      .from('password_reset_tokens')
      .delete()
      .eq('id', resetToken.id);

    // Invalidate all sessions for this user
    await AuthService.logoutAllDevices(resetToken.user_id);

    await AuthService.createAuditLog('PASSWORD_RESET_COMPLETED', {
      userId: resetToken.user_id
    }, req);

    res.json({
      success: true,
      message: 'Password reset successful. Please log in with your new password.'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred'
    });
  }
};

/**
 * Change password (authenticated)
 * POST /api/auth/change-password
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        error: 'Missing fields',
        message: 'All fields are required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: 'Passwords do not match',
        message: 'Please ensure both passwords match'
      });
    }

    // Validate password strength
    const passwordValidation = AuthService.validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Weak password',
        message: passwordValidation.feedback.join('. ')
      });
    }

    // Get current user
    const { data: user, error } = await supabase
      .from('user_profiles')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account not found'
      });
    }

    // Verify current password
    const isValid = await AuthService.comparePassword(currentPassword, user.password_hash);
    if (!isValid) {
      return res.status(401).json({
        error: 'Invalid password',
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const passwordHash = await AuthService.hashPassword(newPassword);

    // Update password
    await supabase
      .from('user_profiles')
      .update({
        password_hash: passwordHash,
        password_changed_at: new Date().toISOString()
      })
      .eq('id', userId);

    await AuthService.createAuditLog('PASSWORD_CHANGED', {
      userId
    }, req);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred'
    });
  }
};

/**
 * Get CSRF token
 * GET /api/auth/csrf-token
 */
const getCSRFToken = (req, res) => {
  const token = SecurityUtils.generateCSRFToken();
  
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  });

  res.json({
    success: true,
    csrfToken: token
  });
};

/**
 * Verify email
 * POST /api/auth/verify-email
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Missing token',
        message: 'Verification token is required'
      });
    }

    const hashedToken = AuthService.hashResetToken(token);

    // Find verification token
    const { data: verificationToken, error } = await supabase
      .from('email_verification_tokens')
      .select('*')
      .eq('token', hashedToken)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !verificationToken) {
      return res.status(400).json({
        error: 'Invalid or expired token',
        message: 'Please request a new verification email'
      });
    }

    // Mark email as verified
    await supabase
      .from('user_profiles')
      .update({
        email_verified: true,
        email_verified_at: new Date().toISOString()
      })
      .eq('id', verificationToken.user_id);

    // Delete used token
    await supabase
      .from('email_verification_tokens')
      .delete()
      .eq('id', verificationToken.id);

    await AuthService.createAuditLog('EMAIL_VERIFIED', {
      userId: verificationToken.user_id
    }, req);

    res.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred'
    });
  }
};

module.exports = {
  login,
  logout,
  logoutAll,
  refreshTokens,
  getSessions,
  requestPasswordReset,
  resetPassword,
  changePassword,
  getCSRFToken,
  verifyEmail,
};
