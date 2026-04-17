const crypto = require('crypto');

/**
 * Security Utilities
 */
class SecurityUtils {
  /**
   * Generate a secure random token
   */
  static generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Hash a string using SHA-256
   */
  static hashString(str) {
    return crypto.createHash('sha256').update(str).digest('hex');
  }

  /**
   * Generate a secure session ID
   */
  static generateSessionId() {
    return crypto.randomBytes(48).toString('base64url');
  }

  /**
   * Generate CSRF token
   */
  static generateCSRFToken() {
    return crypto.randomBytes(32).toString('base64url');
  }

  /**
   * Generate OTP (One-Time Password)
   */
  static generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[crypto.randomInt(0, digits.length)];
    }
    return otp;
  }

  /**
   * Sanitize input string
   */
  static sanitizeInput(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }

  /**
   * Check if string contains potential SQL injection
   */
  static containsSQLInjection(str) {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b)/i,
      /(--)|(\/\*)|(\*\/)/,
      /(\bOR\b|\bAND\b)\s*['"]?\d+['"]?\s*=\s*['"]?\d+/i,
      /['"];\s*(SELECT|INSERT|UPDATE|DELETE|DROP)/i
    ];
    
    if (typeof str !== 'string') return false;
    return sqlPatterns.some(pattern => pattern.test(str));
  }

  /**
   * Check if string contains potential XSS
   */
  static containsXSS(str) {
    const xssPatterns = [
      /<script\b[^>]*>[\s\S]*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
      /<img[^>]+onerror/gi
    ];
    
    if (typeof str !== 'string') return false;
    return xssPatterns.some(pattern => pattern.test(str));
  }

  /**
   * Validate email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password) {
    const result = {
      isValid: false,
      score: 0,
      feedback: []
    };

    if (password.length < 8) {
      result.feedback.push('Password must be at least 8 characters long');
    } else {
      result.score += 1;
    }

    if (password.length >= 12) {
      result.score += 1;
    }

    if (/[A-Z]/.test(password)) {
      result.score += 1;
    } else {
      result.feedback.push('Include at least one uppercase letter');
    }

    if (/[a-z]/.test(password)) {
      result.score += 1;
    } else {
      result.feedback.push('Include at least one lowercase letter');
    }

    if (/[0-9]/.test(password)) {
      result.score += 1;
    } else {
      result.feedback.push('Include at least one number');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      result.score += 1;
    } else {
      result.feedback.push('Include at least one special character');
    }

    result.isValid = result.score >= 4;
    return result;
  }

  /**
   * Mask sensitive data
   */
  static maskEmail(email) {
    if (!email || !email.includes('@')) return email;
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart.substring(0, 2) + '***';
    return `${maskedLocal}@${domain}`;
  }

  static maskPhone(phone) {
    if (!phone) return phone;
    return phone.replace(/(\d{4})\d+(\d{3})/, '$1***$2');
  }

  /**
   * Get client IP from request
   */
  static getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
           req.headers['x-real-ip'] ||
           req.connection?.remoteAddress ||
           req.socket?.remoteAddress ||
           req.ip;
  }

  /**
   * Get device fingerprint from request
   */
  static getDeviceFingerprint(req) {
    const components = [
      req.headers['user-agent'] || '',
      req.headers['accept-language'] || '',
      req.headers['accept-encoding'] || '',
    ];
    return this.hashString(components.join('|'));
  }

  /**
   * Generate secure password reset token
   */
  static generatePasswordResetToken() {
    const token = this.generateToken(32);
    const expires = new Date(Date.now() + 3600000); // 1 hour
    return { token, expires };
  }

  /**
   * Constant-time string comparison to prevent timing attacks
   */
  static secureCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') {
      return false;
    }
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  }
}

module.exports = SecurityUtils;
