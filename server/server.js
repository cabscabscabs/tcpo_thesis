const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Import routes
const chatRouter = require('./chatRouter');
const facultyRoutes = require('./routes/facultyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');

// Import security middleware
const {
  apiLimiter,
  chatLimiter,
  csrfProtection,
  generateCSRFToken,
  validateInput,
  sanitizeRequest,
  cspMiddleware,
  requireHTTPS,
} = require('./middleware/security');

// Import session configuration
const { sessionMiddleware, startSessionCleanup, initRedisClient } = require('./config/session');

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy (required for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

/**
 * Security Middleware
 */

// HTTPS enforcement in production
if (process.env.NODE_ENV === 'production') {
  app.use(requireHTTPS);
}

// Cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET || 'cookie-secret-change-in-production'));

// Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: false, // We'll use our own CSP
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// Custom CSP middleware
app.use(cspMiddleware);

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:8080',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:8080',
      'https://ustp-tpco.ddns.net'
    ];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
    'X-Session-Id'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Per-Page']
}));

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request sanitization
app.use(sanitizeRequest);

// Input validation
app.use(validateInput);

// Global rate limiting
app.use(apiLimiter);

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                   req.connection?.remoteAddress || 
                   req.ip;
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${clientIP}`);
  next();
});

/**
 * Session Middleware (initialized asynchronously)
 */
(async () => {
  try {
    // Initialize Redis and session middleware
    const sessionMw = await sessionMiddleware();
    app.use(sessionMw);
    
    // Start session cleanup
    startSessionCleanup();
    
    console.log('✅ Session middleware initialized');
  } catch (error) {
    console.error('⚠️ Session middleware initialization failed:', error.message);
    console.warn('⚠️ Running without persistent sessions');
  }
})();

/**
 * CSRF Token Generation (for all requests)
 */
app.use(generateCSRFToken);

/**
 * API Routes
 */

// Health check endpoint (no auth required)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    services: {
      redis: 'checking...',
      database: 'connected'
    }
  });
});

// Authentication routes (apply CSRF protection)
app.use('/api/auth', csrfProtection, authRoutes);

// Faculty routes (apply CSRF protection)
app.use('/api/faculty', csrfProtection, facultyRoutes);

// Admin routes (apply CSRF protection)
app.use('/api/admin', csrfProtection, adminRoutes);

// Chat routes (apply specific rate limiting)
app.use('/api', chatLimiter, chatRouter);

/**
 * Static File Serving (Production)
 */
if (process.env.SERVE_FRONTEND === 'true') {
  const frontendPath = path.join(__dirname, '../dist');
  
  app.use(express.static(frontendPath, {
    maxAge: '1d',
    etag: true,
    lastModified: true
  }));
  
  // Serve index.html for all routes (SPA support)
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

/**
 * Error Handling
 */

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  // Handle specific error types
  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    });
  }
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      message: error.message,
      details: error.details
    });
  }
  
  if (error.type === 'entity.too.large') {
    return res.status(413).json({
      error: 'Payload too large',
      message: 'Request body exceeds size limit'
    });
  }
  
  // Don't leak error details in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(error.status || 500).json({
    error: 'Internal server error',
    message: isProduction ? 'Something went wrong on our end' : error.message,
    ...(isProduction ? {} : { stack: error.stack })
  });
});

/**
 * Graceful Shutdown
 */
const gracefulShutdown = async () => {
  console.log('\n🛑 Received shutdown signal, closing connections...');
  
  // Close server
  server.close(() => {
    console.log('✅ HTTP server closed');
  });
  
  // Close Redis connection if needed
  try {
    const { initRedisClient } = require('./config/session');
    const redisClient = await initRedisClient().catch(() => null);
    if (redisClient) {
      await redisClient.quit();
      console.log('✅ Redis connection closed');
    }
  } catch (err) {
    console.warn('⚠️ Redis cleanup warning:', err.message);
  }
  
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

/**
 * Start Server
 */
const server = app.listen(PORT, async () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log('🚀 USTP TPCO Server Started');
  console.log(`${'='.repeat(50)}`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 CORS: ${process.env.ALLOWED_ORIGINS || 'localhost only'}`);
  console.log(`🔐 Session: Redis-based`);
  console.log(`🛡️ Security: CSP, CSRF, Rate Limiting, Input Validation`);
  console.log(`🌐 Frontend: ${process.env.SERVE_FRONTEND === 'true' ? 'Served from dist/' : 'Not served'}`);
  console.log(`${'='.repeat(50)}\n`);
});

module.exports = app;
