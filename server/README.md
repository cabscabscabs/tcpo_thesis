# USTP TPCO AI Chatbot Server

A secure, scalable Express.js backend server for the AI chatbot widget, featuring OpenAI integration, rate limiting, and comprehensive security measures.

## Features

- 🤖 **OpenAI GPT Integration** - Powered by GPT-3.5/4 with configurable parameters
- 🔒 **Security First** - Helmet.js, CORS, input sanitization, and rate limiting
- 📊 **Rate Limiting** - 3 chat requests per 10 seconds per user, 100 requests per 15 minutes globally
- 🎯 **Intent Recognition** - Predefined responses for common support scenarios
- 🛡️ **Data Protection** - Automatic masking of sensitive information (emails, credit cards, SSNs)
- 📱 **Mobile Responsive** - Optimized for all device types
- 🔄 **Session Persistence** - Chat history stored in localStorage
- 📈 **Health Monitoring** - Built-in health check endpoints

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp env.example .env
```

Edit `.env` with your configuration:

```env
# OpenAI API Key (required for AI responses)
OPENAI_API_KEY=sk-your-actual-api-key-here

# Server port
PORT=3001

# CORS origins (your frontend URLs)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Environment
NODE_ENV=development
```

### 3. Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3001` (or your configured PORT).

## API Endpoints

### POST `/api/chat`
Main chat endpoint for processing user messages.

**Request Body:**
```json
{
  "message": "How do I reset my password?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant", 
      "content": "Hi! How can I help you today?"
    }
  ],
  "appName": "USTP TPCO"
}
```

**Response:**
```json
{
  "response": "Here's how to reset your password...",
  "source": "predefined",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "messageId": "msg_1705312200000_abc123def"
}
```

### GET `/api/health`
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "1.0.0"
}
```

## Predefined Responses

The server automatically recognizes and responds to common intents:

- **Password Reset**: Step-by-step password recovery instructions
- **Contact Support**: Support contact information and options
- **Feature Issues**: Troubleshooting guidance for broken features
- **Human Agent**: Escalation to human support

## Security Features

### Input Sanitization
- Removes HTML tags and scripts
- Blocks JavaScript injection attempts
- Sanitizes all user inputs

### Rate Limiting
- **Chat Endpoint**: 3 requests per 10 seconds per IP
- **Global**: 100 requests per 15 minutes per IP
- Configurable via environment variables

### Data Protection
- Automatic masking of sensitive data:
  - Email addresses → `[EMAIL]`
  - Credit card numbers → `[CARD_NUMBER]`
  - Social Security numbers → `[SSN]`
  - Phone numbers → `[PHONE]`
  - IP addresses → `[IP_ADDRESS]`

### CORS Configuration
- Configurable allowed origins
- Secure by default (localhost only in development)
- Credentials support for authenticated requests

## Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `development` | Environment mode |
| `OPENAI_API_KEY` | - | OpenAI API key (required) |
| `ALLOWED_ORIGINS` | `localhost` | Comma-separated CORS origins |
| `SERVE_FRONTEND` | `false` | Serve frontend from dist folder |

### OpenAI Configuration

The server uses these OpenAI parameters:
- **Model**: `gpt-3.5-turbo`
- **Temperature**: `0.7` (balanced creativity)
- **Max Tokens**: `256` (concise responses)
- **System Prompt**: Customized for USTP TPCO support

## Development

### Project Structure
```
server/
├── server.js          # Main server file
├── chatRouter.js      # Chat API routes
├── package.json       # Dependencies
├── env.example        # Environment template
└── README.md          # This file
```

### Adding New Features

1. **New Predefined Responses**: Edit `getPredefinedResponse()` in `chatRouter.js`
2. **Custom Middleware**: Add to `server.js` before routes
3. **New API Endpoints**: Create new route files and import in `server.js`

### Testing

Test the API endpoints using curl or Postman:

```bash
# Health check
curl http://localhost:3001/api/health

# Chat request
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How do I reset my password?", "appName": "USTP TPCO"}'
```

## Production Deployment

### Environment Setup
```env
NODE_ENV=production
PORT=3001
OPENAI_API_KEY=your_production_key
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
SERVE_FRONTEND=true
```

### Process Management
Use PM2 for production process management:

```bash
npm install -g pm2
pm2 start server.js --name "ustp-chat-server"
pm2 startup
pm2 save
```

### Reverse Proxy
Configure Nginx or Apache to proxy requests to the Node.js server:

```nginx
location /api/ {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## Monitoring & Logging

### Health Checks
- Built-in health endpoint for load balancer monitoring
- Uptime tracking and environment information
- Response time monitoring

### Logging
- Request logging with timestamps and IP addresses
- Error logging with stack traces (development only)
- OpenAI API interaction logging

### Performance
- Efficient message processing
- Conversation history optimization (last 5 messages)
- Configurable rate limits for scalability

## Troubleshooting

### Common Issues

**OpenAI API Errors**
- Verify API key is correct and has sufficient credits
- Check rate limits on your OpenAI account
- Ensure the API key has access to GPT-3.5-turbo

**CORS Errors**
- Verify `ALLOWED_ORIGINS` includes your frontend URL
- Check that the frontend is making requests from an allowed origin

**Rate Limiting**
- Adjust rate limit settings in environment variables
- Monitor user behavior for abuse patterns

### Debug Mode
Enable detailed logging by setting:
```env
NODE_ENV=development
LOG_LEVEL=debug
```

## Support

For technical support or questions about the chatbot server:

- 📧 Email: dev-support@ustp-tpco.com
- 📖 Documentation: Check the main project README
- 🐛 Issues: Report bugs in the project repository

## License

MIT License - see LICENSE file for details.
