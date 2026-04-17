const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const SecurityUtils = require('../utils/security');
const { SessionStore } = require('../config/session');

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
const SALT_ROUNDS = 12;

/**
 * Authentication Service
 */
const AuthService = {
  /**
   * Hash password
   */
  async hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  /**
   * Compare password with hash
   */
  async comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  },

  /**
   * Generate JWT access token
   */
  generateAccessToken(payload) {
    return jwt.sign(
      {
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        jti: SecurityUtils.generateToken(16), // Unique token ID
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  },

  /**
   * Generate JWT refresh token
   */
  generateRefreshToken(payload) {
    return jwt.sign(
      {
        ...payload,
        type: 'refresh',
        iat: Math.floor(Date.now() / 1000),
        jti: SecurityUtils.generateToken(16),
      },
      JWT_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );
  },

  /**
   * Generate token pair (access + refresh)
   */
  generateTokenPair(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
      expiresIn: JWT_EXPIRES_IN,
    };
  },

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return { expired: true, error: 'Token has expired' };
      }
      if (error.name === 'JsonWebTokenError') {
        return { invalid: true, error: 'Invalid token' };
      }
      return { error: error.message };
    }
  },

  /**
   * Decode JWT without verification (for inspection)
   */
  decodeToken(token) {
    return jwt.decode(token);
  },

  /**
   * Create session for user
   */
  async createSession(userId, req, additionalData = {}) {
    const sessionId = SecurityUtils.generateSessionId();
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = SecurityUtils.getClientIP(req);
    const deviceFingerprint = SecurityUtils.getDeviceFingerprint(req);

    const sessionData = {
      sessionId,
      userId,
      userAgent,
      ip,
      deviceFingerprint,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      ...additionalData
    };

    await SessionStore.set(sessionId, sessionData);
    return sessionData;
  },

  /**
   * Validate session
   */
  async validateSession(sessionId, req) {
    const session = await SessionStore.get(sessionId);
    if (!session) {
      return { valid: false, error: 'Session not found' };
    }

    // Check expiration
    if (new Date(session.expiresAt) < new Date()) {
      await SessionStore.destroy(sessionId);
      return { valid: false, error: 'Session expired' };
    }

    // Optional: Validate device fingerprint
    const currentFingerprint = SecurityUtils.getDeviceFingerprint(req);
    if (session.deviceFingerprint !== currentFingerprint) {
      // Log suspicious activity
      console.warn(`Device fingerprint mismatch for session ${sessionId}`);
      // Could optionally invalidate the session
    }

    // Update last activity
    session.lastActivity = new Date().toISOString();
    await SessionStore.set(sessionId, session);

    return { valid: true, session };
  },

  /**
   * Destroy session (logout)
   */
  async destroySession(sessionId) {
    return SessionStore.destroy(sessionId);
  },

  /**
   * Logout from all devices
   */
  async logoutAllDevices(userId) {
    return SessionStore.destroyUserSessions(userId);
  },

  /**
   * Get all active sessions for user
   */
  async getUserSessions(userId) {
    return SessionStore.getUserSessions(userId);
  },

  /**
   * Generate password reset token
   */
  generatePasswordResetToken() {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    return { token, hashedToken, expires };
  },

  /**
   * Hash reset token for storage
   */
  hashResetToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
  },

  /**
   * Generate email verification token
   */
  generateEmailVerificationToken() {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const expires = new Date(Date.now() + 86400000); // 24 hours

    return { token, hashedToken, expires };
  },

  /**
   * Validate password strength
   */
  validatePasswordStrength(password) {
    return SecurityUtils.validatePasswordStrength(password);
  },

  /**
   * Check if user needs to change password (based on age)
   */
  async checkPasswordAge(passwordChangedAt) {
    if (!passwordChangedAt) return { needsChange: true };
    
    const maxAgeDays = parseInt(process.env.PASSWORD_MAX_AGE_DAYS || '90');
    const changedAt = new Date(passwordChangedAt);
    const ageInDays = Math.floor((Date.now() - changedAt.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      needsChange: ageInDays > maxAgeDays,
      ageInDays,
      maxAgeDays
    };
  },

  /**
   * Create audit log entry
   */
  async createAuditLog(event, details, req) {
    const { supabase } = require('../middleware/auth');
    
    try {
      await supabase.from('audit_logs').insert({
        event,
        user_id: details.userId,
        ip_address: SecurityUtils.getClientIP(req),
        user_agent: req.headers['user-agent'],
        details: {
          ...details,
          deviceFingerprint: SecurityUtils.getDeviceFingerprint(req)
        },
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  }
};

module.exports = AuthService;
