const session = require('express-session');
const RedisStore = require('connect-redis').default;
const { createClient } = require('redis');
const SecurityUtils = require('../utils/security');

let redisClient = null;

/**
 * Initialize Redis client
 */
const initRedisClient = async () => {
  if (redisClient) return redisClient;

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  
  redisClient = createClient({
    url: redisUrl,
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error('Redis connection failed after 10 retries');
          return new Error('Redis connection failed');
        }
        return Math.min(retries * 100, 3000);
      }
    }
  });

  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  await redisClient.connect();
  return redisClient;
};

/**
 * Session configuration
 */
const createSessionConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    store: new RedisStore({
      client: redisClient,
      prefix: 'ustp-tpco:sess:',
      ttl: 86400, // 24 hours in seconds
    }),
    secret: process.env.SESSION_SECRET || 'your-super-secret-key-change-in-production',
    name: 'ustp-tpco.sid', // Custom session ID cookie name
    resave: false,
    saveUninitialized: false,
    rolling: true, // Reset cookie maxAge on every response
    cookie: {
      secure: isProduction, // HTTPS only in production
      httpOnly: true, // Prevent XSS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict', // CSRF protection
      domain: isProduction ? process.env.COOKIE_DOMAIN : undefined,
      path: '/',
    },
    genid: () => SecurityUtils.generateSessionId(),
  };
};

/**
 * Session middleware
 */
const sessionMiddleware = async () => {
  try {
    await initRedisClient();
    return session(createSessionConfig());
  } catch (error) {
    console.error('Failed to initialize session middleware:', error);
    // Fallback to in-memory store for development
    console.warn('⚠️ Using in-memory session store (not recommended for production)');
    return session({
      secret: process.env.SESSION_SECRET || 'fallback-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      },
    });
  }
};

/**
 * Session store helpers
 */
const SessionStore = {
  /**
   * Get session data
   */
  async get(sessionId) {
    if (!redisClient) return null;
    try {
      const data = await redisClient.get(`ustp-tpco:sess:${sessionId}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  },

  /**
   * Set session data
   */
  async set(sessionId, data, ttl = 86400) {
    if (!redisClient) return false;
    try {
      await redisClient.setEx(
        `ustp-tpco:sess:${sessionId}`,
        ttl,
        JSON.stringify(data)
      );
      return true;
    } catch (error) {
      console.error('Error setting session:', error);
      return false;
    }
  },

  /**
   * Destroy session
   */
  async destroy(sessionId) {
    if (!redisClient) return false;
    try {
      await redisClient.del(`ustp-tpco:sess:${sessionId}`);
      return true;
    } catch (error) {
      console.error('Error destroying session:', error);
      return false;
    }
  },

  /**
   * Get all sessions for a user
   */
  async getUserSessions(userId) {
    if (!redisClient) return [];
    try {
      const keys = await redisClient.keys('ustp-tpco:sess:*');
      const sessions = [];
      
      for (const key of keys) {
        const data = await redisClient.get(key);
        if (data) {
          const session = JSON.parse(data);
          if (session.userId === userId) {
            sessions.push({
              sessionId: key.replace('ustp-tpco:sess:', ''),
              ...session
            });
          }
        }
      }
      
      return sessions;
    } catch (error) {
      console.error('Error getting user sessions:', error);
      return [];
    }
  },

  /**
   * Destroy all sessions for a user (useful for logout all devices)
   */
  async destroyUserSessions(userId) {
    if (!redisClient) return 0;
    try {
      const keys = await redisClient.keys('ustp-tpco:sess:*');
      let count = 0;
      
      for (const key of keys) {
        const data = await redisClient.get(key);
        if (data) {
          const session = JSON.parse(data);
          if (session.userId === userId) {
            await redisClient.del(key);
            count++;
          }
        }
      }
      
      return count;
    } catch (error) {
      console.error('Error destroying user sessions:', error);
      return 0;
    }
  },

  /**
   * Check if session is valid
   */
  async isValid(sessionId) {
    const session = await this.get(sessionId);
    if (!session) return false;
    
    // Check if session has expired
    if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
      await this.destroy(sessionId);
      return false;
    }
    
    return true;
  },

  /**
   * Extend session TTL
   */
  async extend(sessionId, ttl = 86400) {
    if (!redisClient) return false;
    try {
      await redisClient.expire(`ustp-tpco:sess:${sessionId}`, ttl);
      return true;
    } catch (error) {
      console.error('Error extending session:', error);
      return false;
    }
  }
};

/**
 * Clean up expired sessions periodically
 */
const startSessionCleanup = () => {
  setInterval(async () => {
    if (!redisClient) return;
    try {
      const keys = await redisClient.keys('ustp-tpco:sess:*');
      let cleaned = 0;
      
      for (const key of keys) {
        const ttl = await redisClient.ttl(key);
        if (ttl === -1) { // Key exists but has no expiry
          await redisClient.expire(key, 86400);
        }
      }
      
      if (cleaned > 0) {
        console.log(`🧹 Cleaned ${cleaned} expired sessions`);
      }
    } catch (error) {
      console.error('Session cleanup error:', error);
    }
  }, 3600000); // Run every hour
};

module.exports = {
  initRedisClient,
  sessionMiddleware,
  SessionStore,
  startSessionCleanup,
  createSessionConfig,
};
