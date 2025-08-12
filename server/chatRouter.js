const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const router = express.Router();

// Security middleware
router.use(helmet());
router.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Rate limiting: 3 requests per 10 seconds per IP
const chatLimiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 3, // limit each IP to 3 requests per windowMs
  message: {
    error: 'Too many chat requests, please try again later.',
    retryAfter: 10
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to chat endpoint
router.use('/chat', chatLimiter);

// Input sanitization function
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

// Sensitive data masking
const maskSensitiveData = (text) => {
  return text
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
    .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARD_NUMBER]')
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]')
    .replace(/\b\d{10,11}\b/g, '[PHONE]')
    .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP_ADDRESS]');
};

// Predefined responses for common intents
const getPredefinedResponse = (message, appName = 'USTP TPCO') => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('reset password') || lowerMessage.includes('forgot password')) {
    return {
      content: `Here's how to reset your password:

1. Go to the login page
2. Click "Forgot Password" link
3. Enter your email address
4. Check your email for reset instructions
5. Click the reset link and create a new password

If you're still having trouble, you can contact support by saying "agent".`,
      source: 'predefined'
    };
  }
  
  if (lowerMessage.includes('contact support') || lowerMessage.includes('help')) {
    return {
      content: `Here are your support options:

📧 Email: support@${appName.toLowerCase().replace(/\s+/g, '')}.com
💬 Live Chat: Available 24/7 (say "agent")
📞 Phone: +1 (555) 123-4567
⏰ Hours: Monday-Friday 9AM-6PM EST

What specific issue are you experiencing?`,
      source: 'predefined'
    };
  }
  
  if (lowerMessage.includes('feature') && lowerMessage.includes('not working')) {
    return {
      content: `I'd be happy to help troubleshoot this issue. To better assist you:

1. What specific feature are you trying to use?
2. What happens when you try to use it?
3. Are you seeing any error messages?
4. What browser/device are you using?

You can also try refreshing the page or clearing your browser cache. If the issue persists, I can connect you to technical support by saying "agent".`,
      source: 'predefined'
    };
  }
  
  if (lowerMessage.includes('agent') || lowerMessage.includes('human')) {
    return {
      content: `I'm connecting you to a human support agent. Please wait while I transfer you... 

In the meantime, here's what you can expect:
- Response time: Usually within 2-3 minutes
- Available: 24/7 for urgent issues
- They'll have access to your chat history to help you faster`,
      source: 'predefined'
    };
  }
  
  return null;
};

// Chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], appName = 'USTP TPCO' } = req.body;
    
    // Validate input
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message is required and must be a string'
      });
    }
    
    // Sanitize and mask input
    const sanitizedMessage = sanitizeInput(message);
    const maskedMessage = maskSensitiveData(sanitizedMessage);
    
    if (sanitizedMessage.length === 0) {
      return res.status(400).json({
        error: 'Message contains invalid content'
      });
    }
    
    // Check for predefined responses first
    const predefinedResponse = getPredefinedResponse(sanitizedMessage, appName);
    if (predefinedResponse) {
      return res.json({
        response: predefinedResponse.content,
        source: predefinedResponse.source,
        timestamp: new Date().toISOString(),
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
    }
    
    // Check if OpenAI API key is available
    const openAIKey = process.env.OPENAI_API_KEY;
    if (!openAIKey) {
      return res.json({
        response: `I understand you're asking about "${sanitizedMessage}". While I can help with basic navigation and common questions, for more specific assistance, I recommend:

1. Checking our FAQ section
2. Using the search function
3. Contacting human support by saying "agent"

What specific aspect would you like help with?`,
        source: 'fallback',
        timestamp: new Date().toISOString(),
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
    }
    
    // Prepare conversation context (last 5 messages)
    const recentHistory = conversationHistory
      .slice(-5)
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: sanitizeInput(msg.content)
      }))
      .filter(msg => msg.content.length > 0);
    
    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You're a helpful assistant for ${appName}. Guide users through features, troubleshoot issues, and provide documentation links when relevant. Be concise and friendly. If you're uncertain about something, suggest they contact human support by saying "agent".`
          },
          ...recentHistory,
          {
            role: 'user',
            content: sanitizedMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 256,
      }),
    });
    
    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json().catch(() => ({}));
      console.error('OpenAI API error:', openAIResponse.status, errorData);
      
      return res.json({
        response: `I apologize, but I encountered an error processing your request. Please try again or contact support by saying "agent".`,
        source: 'error',
        timestamp: new Date().toISOString(),
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      });
    }
    
    const data = await openAIResponse.json();
    const assistantContent = data.choices[0]?.message?.content || 'I apologize, but I encountered an error processing your request.';
    
    // Log the interaction (without sensitive data)
    console.log(`Chat request processed: ${maskedMessage.substring(0, 50)}... -> ${assistantContent.substring(0, 50)}...`);
    
    res.json({
      response: assistantContent,
      source: 'openai',
      timestamp: new Date().toISOString(),
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      model: data.model,
      usage: data.usage
    });
    
  } catch (error) {
    console.error('Chat endpoint error:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'An unexpected error occurred while processing your request'
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
router.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on our end'
  });
});

module.exports = router;
