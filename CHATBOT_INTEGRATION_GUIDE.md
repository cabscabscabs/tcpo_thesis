# AI Chatbot Widget Integration Guide

## 🚀 Quick Start (3 Lines)

```tsx
import ChatWidget from "@/components/ChatWidget";

// Add to your page/layout
<ChatWidget appName="USTP TPCO" />
```

That's it! The chatbot widget is now active with predefined responses.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
4. [Advanced Configuration](#advanced-configuration)
5. [Backend Setup](#backend-setup)
6. [Customization](#customization)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

## 🎯 Overview

The AI Chatbot Widget is a floating chat interface that provides instant support to users. It features:

- **Floating Design**: Bottom-right corner positioning with smooth animations
- **Smart Responses**: Predefined answers for common scenarios + OpenAI integration
- **Mobile Optimized**: Fully responsive across all devices
- **Session Persistence**: Chat history saved in localStorage
- **Security**: Input sanitization and sensitive data masking

## 📦 Installation

### Frontend (Already Done)

The `ChatWidget` component is already created and available at `src/components/ChatWidget.tsx`.

### Backend (Optional)

For OpenAI-powered responses, set up the Express server:

```bash
cd server
npm install
cp env.example .env
# Edit .env with your OpenAI API key
npm run dev
```

## 🔧 Basic Usage

### 1. Simple Integration

```tsx
import ChatWidget from "@/components/ChatWidget";

function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
      {/* Your page content */}
      
      <ChatWidget appName="USTP TPCO" />
    </div>
  );
}
```

### 2. Add to Layout (Recommended)

For site-wide availability, add to your main layout:

```tsx
// src/components/Layout.tsx or similar
import ChatWidget from "@/components/ChatWidget";

export function Layout({ children }) {
  return (
    <div>
      <Navigation />
      <main>{children}</main>
      <Footer />
      
      {/* Chatbot available on all pages */}
      <ChatWidget appName="USTP TPCO" />
    </div>
  );
}
```

### 3. Multiple Instances

You can have different widgets on different pages:

```tsx
// Home page
<ChatWidget appName="USTP TPCO" position="bottom-right" />

// Services page
<ChatWidget appName="USTP TPCO Services" position="bottom-left" />
```

## ⚙️ Advanced Configuration

### Full Configuration Options

```tsx
<ChatWidget
  appName="USTP TPCO"
  position="bottom-right" // bottom-right, bottom-left, top-right, top-left
  openAIKey="sk-your-api-key-here"
  apiEndpoint="/api/chat"
  className="custom-styles"
/>
```

### Configuration Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appName` | string | "USTP TPCO" | Application name displayed in chat |
| `position` | string | "bottom-right" | Widget position on screen |
| `openAIKey` | string | undefined | OpenAI API key for AI responses |
| `apiEndpoint` | string | "/api/chat" | Backend API endpoint |
| `className` | string | "" | Additional CSS classes |

## 🖥️ Backend Setup

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

```bash
cp env.example .env
```

Edit `.env`:

```env
# Required for AI responses
OPENAI_API_KEY=sk-your-actual-api-key-here

# Server configuration
PORT=3001
NODE_ENV=development

# CORS (your frontend URLs)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. Start Server

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

### 4. Test Backend

```bash
# Health check
curl http://localhost:3001/api/health

# Chat request
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "appName": "USTP TPCO"}'
```

## 🎨 Customization

### 1. Styling

The widget uses your theme system. Customize via CSS variables:

```css
/* src/index.css */
:root {
  --color-primary-main: 240 80% 15%; /* Chat button color */
  --color-primary-dark: 240 80% 10%; /* Hover state */
}
```

### 2. Predefined Responses

Edit `src/components/ChatWidget.tsx`:

```tsx
const getPredefinedResponse = (message: string): string | null => {
  const lowerMessage = message.toLowerCase();
  
  // Add your custom responses
  if (lowerMessage.includes('your custom keyword')) {
    return 'Your custom response here';
  }
  
  // ... existing responses
};
```

### 3. Backend Customization

Edit `server/chatRouter.js`:

```js
const getPredefinedResponse = (message, appName = 'USTP TPCO') => {
  const lowerMessage = message.toLowerCase();
  
  // Add custom business logic
  if (lowerMessage.includes('pricing')) {
    return 'Our pricing information...';
  }
  
  // ... existing responses
};
```

### 4. OpenAI Parameters

Customize AI behavior in `server/chatRouter.js`:

```js
body: JSON.stringify({
  model: 'gpt-4', // or 'gpt-3.5-turbo'
  temperature: 0.5, // Lower = more focused
  max_tokens: 500, // Longer responses
  messages: [
    {
      role: 'system',
      content: 'Your custom system prompt...'
    },
    // ... conversation history
  ]
})
```

## 🧪 Testing

### 1. Test Predefined Responses

Try these messages to test built-in functionality:

- "How do I reset my password?"
- "I need to contact support"
- "Feature X is not working"
- "Connect me to a human agent"

### 2. Test AI Responses

With OpenAI configured, try:

- "What is USTP TPCO?"
- "How can you help me?"
- "Explain your services"

### 3. Test Error Handling

- Disconnect internet to test offline behavior
- Send very long messages
- Test on mobile devices

### 4. Demo Page

Visit `/chat-demo` to see a comprehensive demonstration of all features.

## 🔍 Troubleshooting

### Common Issues

#### Widget Not Appearing

```tsx
// Check z-index conflicts
<ChatWidget className="z-50" />

// Verify component is imported
import ChatWidget from "@/components/ChatWidget";
```

#### OpenAI Not Working

```bash
# Check API key
echo $OPENAI_API_KEY

# Verify server is running
curl http://localhost:3001/api/health

# Check CORS configuration
# Ensure frontend URL is in ALLOWED_ORIGINS
```

#### Styling Issues

```css
/* Ensure theme variables are defined */
:root {
  --color-primary-main: 240 80% 15%;
  --color-primary-dark: 240 80% 10%;
}
```

### Debug Mode

Enable detailed logging:

```tsx
// Frontend
console.log('ChatWidget props:', { appName, openAIKey, apiEndpoint });

// Backend
NODE_ENV=development
LOG_LEVEL=debug
```

### Performance Issues

- Check rate limiting settings
- Monitor OpenAI API usage
- Verify conversation history length (limited to last 5 messages)

## 📱 Mobile Optimization

The widget is automatically optimized for mobile:

- Touch-friendly button sizes
- Responsive chat window
- Mobile-optimized input handling
- Swipe gestures (future enhancement)

## 🔒 Security Features

### Built-in Protection

- **Input Sanitization**: Removes HTML/scripts
- **Rate Limiting**: 3 requests per 10 seconds
- **Data Masking**: Automatically masks sensitive information
- **CORS Protection**: Configurable allowed origins

### Production Security

```env
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com
SERVE_FRONTEND=true
```

## 📊 Analytics & Monitoring

### Health Endpoints

```bash
# Server health
GET /api/health

# Chat metrics (future enhancement)
GET /api/chat/metrics
```

### Logging

The server logs:
- All chat requests (with sensitive data masked)
- OpenAI API interactions
- Error conditions
- Performance metrics

## 🚀 Deployment

### Frontend

```bash
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend

```bash
# Production
NODE_ENV=production npm start

# With PM2
npm install -g pm2
pm2 start server.js --name "chat-server"
pm2 startup
pm2 save
```

### Environment Variables

```env
# Production
NODE_ENV=production
PORT=3001
OPENAI_API_KEY=sk-prod-key
ALLOWED_ORIGINS=https://yourdomain.com
SERVE_FRONTEND=true
```

## 📚 API Reference

### Frontend Component

```tsx
interface ChatWidgetProps {
  className?: string;
  apiEndpoint?: string;
  openAIKey?: string;
  appName?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}
```

### Backend API

```typescript
// POST /api/chat
interface ChatRequest {
  message: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  appName?: string;
}

interface ChatResponse {
  response: string;
  source: 'predefined' | 'openai' | 'fallback' | 'error';
  timestamp: string;
  messageId: string;
  model?: string;
  usage?: any;
}
```

## 🤝 Support

### Getting Help

1. **Check this guide** for common solutions
2. **Review the demo page** at `/chat-demo`
3. **Check server logs** for error details
4. **Test with simple messages** first

### Contributing

To enhance the chatbot:

1. **Frontend**: Edit `src/components/ChatWidget.tsx`
2. **Backend**: Edit `server/chatRouter.js`
3. **Styling**: Modify theme variables in `src/index.css`
4. **Documentation**: Update this guide

## 📄 License

This chatbot widget is part of the USTP TPCO project and follows the same licensing terms.

---

**Ready to get started?** The widget is already integrated into your app. Just visit `/chat-demo` to see it in action!
