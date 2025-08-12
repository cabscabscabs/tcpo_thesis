import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  isError?: boolean;
}

interface ChatWidgetProps {
  className?: string;
  apiEndpoint?: string;
  openAIKey?: string;
  appName?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

// Utility functions
const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
};

const maskSensitiveData = (text: string): string => {
  return text
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
    .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[CARD_NUMBER]')
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]')
    .replace(/\b\d{10,11}\b/g, '[PHONE]');
};

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Predefined responses for common intents
const getPredefinedResponse = (message: string): string | null => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('reset password') || lowerMessage.includes('forgot password')) {
    return `Here's how to reset your password:

1. Go to the login page
2. Click "Forgot Password" link
3. Enter your email address
4. Check your email for reset instructions
5. Click the reset link and create a new password

If you're still having trouble, you can contact support by saying "agent".`;
  }
  
  if (lowerMessage.includes('contact support') || lowerMessage.includes('help')) {
    return `Here are your support options:

📧 Email: support@ustp-tpco.com
💬 Live Chat: Available 24/7 (say "agent")
📞 Phone: +1 (555) 123-4567
⏰ Hours: Monday-Friday 9AM-6PM EST

What specific issue are you experiencing?`;
  }
  
  if (lowerMessage.includes('feature') && lowerMessage.includes('not working')) {
    return `I'd be happy to help troubleshoot this issue. To better assist you:

1. What specific feature are you trying to use?
2. What happens when you try to use it?
3. Are you seeing any error messages?
4. What browser/device are you using?

You can also try refreshing the page or clearing your browser cache. If the issue persists, I can connect you to technical support by saying "agent".`;
  }
  
  if (lowerMessage.includes('agent') || lowerMessage.includes('human')) {
    return `I'm connecting you to a human support agent. Please wait while I transfer you... 

In the meantime, here's what you can expect:
- Response time: Usually within 2-3 minutes
- Available: 24/7 for urgent issues
- They'll have access to your chat history to help you faster`;
  }
  
  return null;
};

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  className,
  apiEndpoint = '/api/chat',
  openAIKey,
  appName = 'USTP TPCO',
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      content: `Hello! I'm your AI assistant for ${appName}. I can help you navigate the app, troubleshoot issues, and answer questions. How can I help you today?`,
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${generateId()}`);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat_history_${sessionId}`);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
  }, [sessionId]);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 1) { // Don't save just the welcome message
      localStorage.setItem(`chat_history_${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = sanitizeInput(inputValue);
    const maskedMessage = maskSensitiveData(userMessage);
    
    // Add user message
    const userMsg: ChatMessage = {
      id: generateId(),
      content: userMessage,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    // Check for predefined responses first
    const predefinedResponse = getPredefinedResponse(userMessage);
    
    if (predefinedResponse) {
      const assistantMsg: ChatMessage = {
        id: generateId(),
        content: predefinedResponse,
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsLoading(false);
      return;
    }

    try {
      // Try to use OpenAI API if key is provided
      if (openAIKey) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
              ...messages.slice(-5).map(msg => ({
                role: msg.role,
                content: msg.content
              })),
              {
                role: 'user',
                content: userMessage
              }
            ],
            temperature: 0.7,
            max_tokens: 256,
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const assistantContent = data.choices[0]?.message?.content || 'I apologize, but I encountered an error processing your request.';
        
        const assistantMsg: ChatMessage = {
          id: generateId(),
          content: assistantContent,
          role: 'assistant',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        // Fallback to local processing
        const fallbackResponse = `I understand you're asking about "${userMessage}". While I can help with basic navigation and common questions, for more specific assistance, I recommend:

1. Checking our FAQ section
2. Using the search function
3. Contacting human support by saying "agent"

What specific aspect would you like help with?`;
        
        const assistantMsg: ChatMessage = {
          id: generateId(),
          content: fallbackResponse,
          role: 'assistant',
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: generateId(),
        content: 'I apologize, but I encountered an error processing your request. Please try again or contact support by saying "agent".',
        role: 'assistant',
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMsg]);
      setError('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle escape key to close chat
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Handle click outside to close chat
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (isOpen && !target.closest('.chat-widget')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setError(null);
    }
  };

  const clearChat = () => {
    setMessages([messages[0]]); // Keep welcome message
    localStorage.removeItem(`chat_history_${sessionId}`);
  };

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  return (
    <div className={cn('fixed z-50 chat-widget', positionClasses[position], className)}>
      {/* Floating Button */}
      <Button
        onClick={toggleChat}
        className={cn(
          'h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110',
          'bg-theme-primary-main hover:bg-theme-primary-dark text-white'
        )}
        aria-label={isOpen ? "Close chat widget" : "Open chat widget"}
        title={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-96 h-[500px] shadow-2xl border-0 bg-white dark:bg-gray-900">
          <CardHeader className="pb-3 bg-theme-primary-main text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5" />
                <CardTitle className="text-lg">AI Assistant</CardTitle>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs bg-white/20 text-white">
                  {appName}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearChat}
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  aria-label="Clear chat history"
                  title="Clear chat history"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleChat}
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  aria-label="Close chat"
                  title="Close chat"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 h-full flex flex-col">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg px-3 py-2 text-sm',
                      message.role === 'user'
                        ? 'bg-theme-primary-main text-white'
                        : message.isError
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    )}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {message.role === 'user' ? (
                        <User className="h-3 w-3" />
                      ) : (
                        <Bot className="h-3 w-3" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-3 w-3" />
                      <span className="text-xs opacity-70">Typing...</span>
                    </div>
                    <div className="flex space-x-1 mt-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Error Display */}
            {error && (
              <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-theme-primary-main hover:bg-theme-primary-dark text-white"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChatWidget;
