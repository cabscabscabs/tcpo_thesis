const rateLimit = require('express-rate-limit');
const SecurityUtils = require('../utils/security');

/**
 * Rate Limiting Configuration
 */

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Please try again later',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return SecurityUtils.getClientIP(req);
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  }
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 attempts per windowMs
  message: {
    error: 'Too many authentication attempts',
    message: 'Please try again after 15 minutes',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `auth:${SecurityUtils.getClientIP(req)}`;
  },
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Login rate limiter (stricter)
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 login attempts per hour
  message: {
    error: 'Too many login attempts',
    message: 'Account temporarily locked. Please try again after 1 hour.',
    retryAfter: 60 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `login:${SecurityUtils.getClientIP(req)}:${req.body?.email || 'unknown'}`;
  },
});

// Password reset rate limiter
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Only 3 password reset requests per hour
  message: {
    error: 'Too many password reset requests',
    message: 'Please try again after 1 hour',
    retryAfter: 60 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return `pwd-reset:${SecurityUtils.getClientIP(req)}`;
  },
});

// File upload rate limiter
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  message: {
    error: 'Too many uploads',
    message: 'Please try again later',
    retryAfter: 60 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Chat/AI rate limiter
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 messages per minute
  message: {
    error: 'Too many messages',
    message: 'Please slow down',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * CSRF Protection Middleware
 * Using double-submit cookie pattern
 */
const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // Skip CSRF for webhook endpoints
  const skipPaths = ['/api/webhooks', '/api/health'];
  if (skipPaths.some(path => req.path.startsWith(path))) {
    return next();
  }

  const csrfToken = req.headers['x-csrf-token'] || req.body?._csrf;
  const csrfCookie = req.cookies?.['XSRF-TOKEN'];

  if (!csrfToken || !csrfCookie) {
    return res.status(403).json({
      error: 'CSRF token missing',
      message: 'Security validation failed'
    });
  }

  if (!SecurityUtils.secureCompare(csrfToken, csrfCookie)) {
    return res.status(403).json({
      error: 'CSRF token invalid',
      message: 'Security validation failed'
    });
  }

  next();
};

/**
 * Generate CSRF token
 */
const generateCSRFToken = (req, res, next) => {
  const token = SecurityUtils.generateCSRFToken();
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false, // Must be accessible to JavaScript
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  });
  req.csrfToken = token;
  next();
};

/**
 * Input Validation Middleware
 */
const validateInput = (req, res, next) => {
  const checkObject = (obj, path = '') => {
    if (!obj || typeof obj !== 'object') return;
    
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string') {
        // Check for SQL injection
        if (SecurityUtils.containsSQLInjection(value)) {
          console.warn(`Potential SQL injection detected at ${currentPath}`);
          return res.status(400).json({
            error: 'Invalid input',
            message: 'Input contains disallowed characters'
          });
        }
        
        // Check for XSS
        if (SecurityUtils.containsXSS(value)) {
          console.warn(`Potential XSS detected at ${currentPath}`);
          return res.status(400).json({
            error: 'Invalid input',
            message: 'Input contains disallowed characters'
          });
        }
      } else if (typeof value === 'object') {
        checkObject(value, currentPath);
      }
    }
  };

  // Check body, query, and params
  checkObject(req.body, 'body');
  checkObject(req.query, 'query');
  checkObject(req.params, 'params');

  next();
};

/**
 * Content Security Policy middleware
 */
const cspMiddleware = (req, res, next) => {
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://api.mistral.ai https://pwtmtnvedemabvwamllq.supabase.co",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
  ];

  res.setHeader('Content-Security-Policy', cspDirectives.join('; '));
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};

/**
 * Request sanitization middleware
 */
const sanitizeRequest = (req, res, next) => {
  const sanitize = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    const sanitized = Array.isArray(obj) ? [] : {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = SecurityUtils.sanitizeInput(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitize(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  };

  req.body = sanitize(req.body);
  req.query = sanitize(req.query);

  next();
};

/**
 * IP whitelist middleware
 */
const ipWhitelist = (whitelist = []) => {
  return (req, res, next) => {
    if (whitelist.length === 0) return next();
    
    const clientIP = SecurityUtils.getClientIP(req);
    
    if (!whitelist.includes(clientIP)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Your IP is not authorized'
      });
    }
    
    next();
  };
};

/**
 * Require HTTPS middleware
 */
const requireHTTPS = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') return next();
  
  const isHTTPS = req.secure || 
                  req.headers['x-forwarded-proto'] === 'https' ||
                  req.headers['x-forwarded-ssl'] === 'on';
  
  if (!isHTTPS) {
    return res.status(403).json({
      error: 'HTTPS required',
      message: 'Please use a secure connection'
    });
  }
  
  next();
};

/**
 * Session validation middleware
 */
const validateSession = async (req, res, next) => {
  const sessionId = req.sessionID || req.headers['x-session-id'];
  
  if (!sessionId) {
    return res.status(401).json({
      error: 'Session required',
      message: 'Please log in to continue'
    });
  }

  const { SessionStore } = require('../config/session');
  const validation = await SessionStore.isValid(sessionId);
  
  if (!validation) {
    return res.status(401).json({
      error: 'Invalid session',
      message: 'Please log in again'
    });
  }
  
  next();
};

module.exports = {
  // Rate limiters
  apiLimiter,
  authLimiter,
  loginLimiter,
  passwordResetLimiter,
  uploadLimiter,
  chatLimiter,
  
  // Security middleware
  csrfProtection,
  generateCSRFToken,
  validateInput,
  sanitizeRequest,
  cspMiddleware,
  ipWhitelist,
  requireHTTPS,
  validateSession,
};
