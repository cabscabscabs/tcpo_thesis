import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Bot, User, Loader2, AlertCircle, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  isError?: boolean;
  sources?: string[];
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

// Expandable Sources Component
const SourcesAccordion: React.FC<{ sources: string[] }> = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!sources || sources.length === 0) return null;
  
  return (
    <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
      >
        <FileText className="h-3 w-3" />
        <span>{sources.length} source{sources.length > 1 ? 's' : ''}</span>
        {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      
      {isOpen && (
        <div className="mt-2 space-y-1">
          {sources.map((source, index) => (
            <div key={index} className="flex items-start space-x-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="text-gray-400">•</span>
              <span className="break-all">{source}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Predefined responses for common intents
const getPredefinedResponse = (message: string): string | null => {
  const lowerMessage = message.toLowerCase();
  
  // About page - Team information
  if (lowerMessage.includes('team') || lowerMessage.includes('staff') || lowerMessage.includes('who works') || lowerMessage.includes('director')) {
    return `Our Expert Team at USTP TPCO:

Leadership:
- Dr. Venessa Garcia - Director, Technology Promotions and Commercialization Office

Unit Managers:
- Engr. Gladdy Christie Compasan - Manager, Innovation and Technology Support Unit
- Ms. Flora Monica Mabaylan - Manager, Promotions Management Unit  
- Ms. Rhea Suzette Haguisan - Manager, Business Development Unit

Technical Staff:
- Engr. Jodie Rey Fernandez - Technology Promotions Officer
- Engr. Clark Darwin Gozon - Technical Expert
- Engr. Mark Lister Nalupa - Technical Expert
- Noreza P. Aleno - Administrative Staff
- Krystia Ces G. Napili - Science Research Specialist
- Michael J. Cerbito - Administrative Assistant

You can view the full team on the About page.`;
  }
  
  // About page - Journey/Milestones
  if (lowerMessage.includes('journey') || lowerMessage.includes('history') || lowerMessage.includes('started') || lowerMessage.includes('when') || lowerMessage.includes('milestone') || lowerMessage.includes('established')) {
    return `USTP TPCO Journey:

2018 - TPCO Establishment: Founded as USTP's dedicated technology transfer office

2019 - First Patent Grant: Achieved first successful patent registration

2020 - Industry Partnership Program: Launched formal industry-academe collaboration

2021 - CDO b.i.t.e.s. Partnership: Strategic alliance for startup incubation

2022 - IP Portfolio Milestone: Reached 15 patents granted

2023 - Regional Recognition: Awarded Outstanding Technology Transfer Office in Mindanao

2024 - Innovation Hub Launch: Opened state-of-the-art facility

View the full timeline on the About page.`;
  }
  
  // About page - Partners
  if (lowerMessage.includes('partner') || lowerMessage.includes('collaborat')) {
    return `Our Strategic Partners:

- Oro Chamber of Commerce and Industry
- Ateneo Innovation and Patent Office (IPO)
- Department of Science and Technology (DOST) Region X
- Department of Trade and Industry (DTI) Misamis Oriental
- CDO b.i.t.e.s. (business innovation technology e-startup)
- Intellectual Property Office of the Philippines (IPOPhil)

Learn more on the About page.`;
  }
  
  // Contact information
  if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email') || lowerMessage.includes('address') || lowerMessage.includes('location')) {
    return `Contact USTP TPCO:

📍 Address:
USTP Technology Transfer Office
Cagayan de Oro Campus
Cagayan de Oro City, Philippines 9000

📞 Phone:
+63 (088) 856-1738
+63 (088) 856-1739

📧 Email:
tpco@ustp.edu.ph
info@ustp.edu.ph

⏰ Office Hours:
Monday - Friday, 8:00 AM - 5:00 PM

Visit the Contact page to schedule a meeting.`;
  }
  
  // Mission/Vision
  if (lowerMessage.includes('mission') || lowerMessage.includes('vision') || lowerMessage.includes('values')) {
    return `USTP TPCO:

Our Mission:
To accelerate the translation of USTP research innovations into market-ready technologies that address regional and national development needs.

Our Vision:
To be the premier technology transfer office in the Philippines, recognized for excellence in innovation commercialization.

Our Values:
- Innovation: Fostering creativity and breakthrough thinking
- Integrity: Ethical practices in all partnerships
- Excellence: Commitment to quality
- Collaboration: Building meaningful partnerships`;
  }
  
  if (lowerMessage.includes('reset password') || lowerMessage.includes('forgot password')) {
    return `Here's how to reset your password:

1. Go to the login page
2. Click "Forgot Password" link
3. Enter your email address
4. Check your email for reset instructions
5. Click the reset link and create a new password

If you're still having trouble, you can contact support at tpco@ustp.edu.ph.`;
  }
  
  if (lowerMessage.includes('contact support') || lowerMessage.includes('help')) {
    return `Here are your support options:

📧 Email: tpco@ustp.edu.ph
📞 Phone: +63 (088) 856-1738
💬 Live Chat: Available during office hours
⏰ Hours: Monday-Friday 8AM-5PM

What specific issue are you experiencing?`;
  }
  
  if (lowerMessage.includes('feature') && lowerMessage.includes('not working')) {
    return `I'd be happy to help troubleshoot this issue. To better assist you:

1. What specific feature are you trying to use?
2. What happens when you try to use it?
3. Are you seeing any error messages?
4. What browser/device are you using?

You can also try refreshing the page or clearing your browser cache. If the issue persists, contact us at tpco@ustp.edu.ph.`;
  }
  
  if (lowerMessage.includes('agent') || lowerMessage.includes('human')) {
    return `For immediate assistance, please contact us directly:

📧 Email: tpco@ustp.edu.ph
📞 Phone: +63 (088) 856-1738

Our team is available Monday-Friday, 8:00 AM - 5:00 PM.`;
  }
  
  return null;
};

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  className,
  apiEndpoint = 'http://localhost:8000/query',
  openAIKey,
  appName = 'USTP TPCO',
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      content: `Hello! I'm your AI assistant for ${appName}. I can help answer questions about patents, IP protection, technology transfer, and USTP TPCO processes.`,
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);

  // Suggested questions for users
  const suggestedQuestions = [
    "What is a patent?",
    "How do I file a patent application?",
    "Who is the TPCO Director?",
    "What services does TPCO offer?",
    "How can I contact TPCO?"
  ];
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
      // Call MISTRAL RAG API
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantContent = data.answer || 'I apologize, but I encountered an error processing your request.';
      
      // Only include sources if they exist and the answer actually references documents
      const hasSources = data.sources && data.sources.length > 0 && 
                        !assistantContent.toLowerCase().includes('how can you help') &&
                        !assistantContent.toLowerCase().includes('you can ask questions') &&
                        !assistantContent.toLowerCase().includes('how can i assist you');
      
      const assistantMsg: ChatMessage = {
        id: generateId(),
        content: assistantContent,
        role: 'assistant',
        timestamp: new Date(),
        sources: hasSources ? data.sources : undefined,
      };
      
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      // Show detailed error in console for debugging
      if (err instanceof Error) {
        console.error('Error details:', err.message);
      }
      
      // Fallback to predefined responses if API fails
      const fallbackResponse = getPredefinedResponse(userMessage);
      if (fallbackResponse) {
        const assistantMsg: ChatMessage = {
          id: generateId(),
          content: fallbackResponse,
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: generateId(),
          content: `Error: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again or contact support.`,
          role: 'assistant',
          timestamp: new Date(),
          isError: true,
        };
        setMessages(prev => [...prev, errorMsg]);
        setError('Failed to get response. Please try again.');
      }
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
    'bottom-right': 'bottom-2 right-2 md:bottom-4 md:right-4',
    'bottom-left': 'bottom-2 left-2 md:bottom-4 md:left-4',
    'top-right': 'top-2 right-2 md:top-4 md:right-4',
    'top-left': 'top-2 left-2 md:top-4 md:left-4',
  };

  return (
    <div className={cn('fixed z-50 chat-widget', positionClasses[position], className)}>
             {/* Floating Button */}
       <Button
         onClick={toggleChat}
         className={cn(
           'h-12 w-12 md:h-14 md:w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110',
           'bg-theme-primary-main hover:bg-theme-primary-dark text-white'
         )}
         aria-label={isOpen ? "Close chat widget" : "Open chat widget"}
         title={isOpen ? "Close chat" : "Open chat"}
       >
         {isOpen ? <X className="h-5 w-5 md:h-6 md:w-6" /> : <MessageCircle className="h-5 w-5 md:h-6 md:w-6" />}
       </Button>

             {/* Chat Window */}
       {isOpen && (
         <Card className="absolute bottom-16 right-0 w-[calc(100vw-2rem)] max-w-sm h-[calc(100vh-8rem)] max-h-[500px] shadow-2xl border-0 bg-white dark:bg-gray-900 md:w-96 md:h-[500px] md:bottom-16 md:right-0">
                     <CardHeader className="pb-3 bg-theme-primary-main text-white rounded-t-lg">
             <div className="flex items-center justify-between">
               <div className="flex items-center space-x-2">
                 <Bot className="h-4 w-4 md:h-5 md:w-5" />
                 <CardTitle className="text-base md:text-lg">AI Assistant</CardTitle>
               </div>
               <div className="flex items-center space-x-1 md:space-x-2">
                 <Badge variant="secondary" className="text-xs bg-white/20 text-white hidden sm:block">
                   {appName}
                 </Badge>
                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={clearChat}
                   className="h-8 w-8 md:h-6 md:w-6 p-0 text-white hover:bg-white/20"
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
                   className="h-8 w-8 md:h-6 md:w-6 p-0 text-white hover:bg-white/20"
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
             <ScrollArea className="flex-1 p-2 md:p-4 space-y-3 md:space-y-4">
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
                       'max-w-[85%] md:max-w-[80%] rounded-lg px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm',
                       message.role === 'user'
                         ? 'bg-theme-primary-main text-white'
                         : message.isError
                         ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                         : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                     )}
                   >
                     <div className="flex items-center space-x-1 md:space-x-2 mb-1">
                       {message.role === 'user' ? (
                         <User className="h-2.5 w-2.5 md:h-3 md:w-3" />
                       ) : (
                         <Bot className="h-2.5 w-2.5 md:h-3 md:w-3" />
                       )}
                       <span className="text-xs opacity-70">
                         {message.timestamp.toLocaleTimeString([], { 
                           hour: '2-digit', 
                           minute: '2-digit' 
                         })}
                       </span>
                     </div>
                     <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>
                     {message.sources && message.sources.length > 0 && (
                       <SourcesAccordion sources={message.sources} />
                     )}
                   </div>
                 </div>
               ))}
              
                             {isLoading && (
                 <div className="flex justify-start">
                   <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm">
                     <div className="flex items-center space-x-1 md:space-x-2">
                       <Bot className="h-2.5 w-2.5 md:h-3 md:w-3" />
                       <span className="text-xs opacity-70">Typing...</span>
                     </div>
                     <div className="flex space-x-1 mt-1.5 md:mt-2">
                       <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce"></div>
                       <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                       <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                     </div>
                   </div>
                 </div>
               )}
              
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Suggested Questions */}
            {messages.length === 1 && !isLoading && (
              <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputValue(question);
                        setTimeout(() => handleSendMessage(), 100);
                      }}
                      className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full transition-colors text-left"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

                         {/* Error Display */}
             {error && (
               <div className="px-2 py-1.5 md:px-4 md:py-2 bg-red-50 dark:bg-red-900/20 border-t border-red-200 dark:border-red-800">
                 <div className="flex items-center space-x-1 md:space-x-2 text-red-600 dark:text-red-400 text-xs md:text-sm">
                   <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
                   <span>{error}</span>
                 </div>
               </div>
             )}

                         {/* Input Area */}
             <div className="p-2 md:p-4 border-t border-gray-200 dark:border-gray-700">
               <div className="flex space-x-2">
                 <Input
                   ref={inputRef}
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   onKeyPress={handleKeyPress}
                   placeholder="Type your message..."
                   className="flex-1 text-xs md:text-sm h-8 md:h-10"
                   disabled={isLoading}
                 />
                 <Button
                   onClick={handleSendMessage}
                   disabled={!inputValue.trim() || isLoading}
                   className="bg-theme-primary-main hover:bg-theme-primary-dark text-white h-8 w-8 md:h-10 md:w-10 p-0"
                 >
                   {isLoading ? (
                     <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
                   ) : (
                     <Send className="h-3 w-3 md:h-4 md:w-4" />
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
