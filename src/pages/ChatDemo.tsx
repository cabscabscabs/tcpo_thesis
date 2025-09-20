import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Bot, Shield, Zap, Smartphone, Globe } from 'lucide-react';
import ChatWidget from '@/components/ChatWidget';

const ChatDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: 'AI-Powered Responses',
      description: 'Powered by OpenAI GPT-3.5/4 for intelligent, context-aware assistance'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Security First',
      description: 'Input sanitization, rate limiting, and sensitive data masking'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Fast & Responsive',
      description: 'Optimized for quick responses with typing indicators and smooth animations'
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: 'Mobile Optimized',
      description: 'Fully responsive design that works perfectly on all devices'
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Multi-Language Ready',
      description: 'Built to support multiple languages and localization'
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: 'Session Persistence',
      description: 'Chat history saved locally for seamless user experience'
    }
  ];

  const predefinedIntents = [
    {
      intent: 'Password Reset',
      example: 'How do I reset my password?',
      response: 'Step-by-step password recovery instructions'
    },
    {
      intent: 'Contact Support',
      example: 'I need to contact support',
      response: 'Support contact information and options'
    },
    {
      intent: 'Feature Issues',
      example: 'Feature X is not working',
      response: 'Troubleshooting guidance and escalation'
    },
    {
      intent: 'Human Agent',
      example: 'Connect me to a human',
      response: 'Escalation to human support team'
    }
  ];

  const integrationSteps = [
    {
      step: 1,
      title: 'Add Component',
      code: 'import ChatWidget from "@/components/ChatWidget";',
      description: 'Import the ChatWidget component into your page or layout'
    },
    {
      step: 2,
      title: 'Place Widget',
      code: '<ChatWidget appName="Your App" />',
      description: 'Add the widget to your JSX with your app name'
    },
    {
      step: 3,
      title: 'Configure (Optional)',
      code: '<ChatWidget openAIKey="sk-..." apiEndpoint="/api/chat" />',
      description: 'Optionally configure OpenAI API key and custom endpoint'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-theme-neutral-light to-theme-neutral-white dark:from-theme-neutral-dark dark:to-theme-neutral-gray">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-theme-primary-main mb-4">
            AI Chatbot Widget Demo
          </h1>
          <p className="text-xl text-theme-neutral-gray dark:text-theme-neutral-light max-w-3xl mx-auto">
            Experience the power of our intelligent AI chatbot widget designed to enhance user support 
            and navigation across your USTP TPCO web application.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-2 border-theme-primary-main/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-theme-primary-main">
                    <Bot className="h-5 w-5" />
                    <span>What is it?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-theme-neutral-gray dark:text-theme-neutral-light">
                    The AI Chatbot Widget is a floating chat interface that provides instant support 
                    to users navigating your web application. It combines predefined responses for 
                    common scenarios with OpenAI's advanced language processing capabilities.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-theme-primary-main/10 text-theme-primary-main">
                      React + TypeScript
                    </Badge>
                    <Badge variant="secondary" className="bg-theme-secondary-main/10 text-theme-secondary-main">
                      OpenAI GPT
                    </Badge>
                    <Badge variant="secondary" className="bg-theme-accent-main/10 text-theme-accent-main">
                      Express Backend
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-theme-secondary-main/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-theme-secondary-main">
                    <Zap className="h-5 w-5" />
                    <span>Key Benefits</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-theme-neutral-gray dark:text-theme-neutral-light">
                    <li className="flex items-start space-x-2">
                      <span className="text-theme-secondary-main">•</span>
                      <span>24/7 automated support availability</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-theme-secondary-main">•</span>
                      <span>Reduced support ticket volume</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-theme-secondary-main">•</span>
                      <span>Instant response to common questions</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-theme-secondary-main">•</span>
                      <span>Seamless escalation to human agents</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-theme-primary-main/10 rounded-lg text-theme-primary-main">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-theme-neutral-gray dark:text-theme-neutral-light">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-2 border-theme-accent-main/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-theme-accent-main">
                  <MessageCircle className="h-5 w-5" />
                  <span>Predefined Intent Recognition</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {predefinedIntents.map((intent, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-semibold text-theme-primary-main">{intent.intent}</h4>
                      <p className="text-sm text-theme-neutral-gray dark:text-theme-neutral-light">
                        <span className="font-medium">Example:</span> "{intent.example}"
                      </p>
                      <p className="text-sm text-theme-neutral-gray dark:text-theme-neutral-light">
                        <span className="font-medium">Response:</span> {intent.response}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integration Tab */}
          <TabsContent value="integration" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-theme-primary-main">3-Line Integration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {integrationSteps.map((step) => (
                  <div key={step.step} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-theme-primary-main text-white rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-theme-primary-main">{step.title}</h4>
                      <p className="text-theme-neutral-gray dark:text-theme-neutral-light">
                        {step.description}
                      </p>
                      <div className="bg-theme-neutral-dark text-theme-neutral-light p-3 rounded-lg font-mono text-sm">
                        {step.code}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-theme-secondary-main/20">
                <CardHeader>
                  <CardTitle className="text-theme-secondary-main">Frontend Only</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-theme-neutral-gray dark:text-theme-neutral-light mb-4">
                    Use the widget with predefined responses only (no OpenAI API required):
                  </p>
                  <div className="bg-theme-neutral-dark text-theme-neutral-light p-3 rounded-lg font-mono text-sm">
                    {`<ChatWidget appName="USTP TPCO" />`}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-theme-accent-main/20">
                <CardHeader>
                  <CardTitle className="text-theme-accent-main">With OpenAI</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-theme-neutral-gray dark:text-theme-neutral-light mb-4">
                    Enable AI-powered responses with OpenAI integration:
                  </p>
                  <div className="bg-theme-neutral-dark text-theme-neutral-light p-3 rounded-lg font-mono text-sm">
                    {`<ChatWidget 
  appName="USTP TPCO"
  openAIKey="sk-..."
  apiEndpoint="/api/chat"
/>`}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Testing Tab */}
          <TabsContent value="testing" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-theme-primary-main">Try the Chatbot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-theme-neutral-gray dark:text-theme-neutral-light">
                  The chatbot widget is currently active on this page! Look for the floating chat button 
                  in the bottom-right corner. Try these test scenarios:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-theme-primary-main">Basic Questions</h4>
                    <ul className="space-y-2 text-sm text-theme-neutral-gray dark:text-theme-neutral-light">
                      <li>• "Hello, how can you help me?"</li>
                      <li>• "What features do you support?"</li>
                      <li>• "Tell me about USTP TPCO"</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-theme-primary-main">Support Scenarios</h4>
                    <ul className="space-y-2 text-sm text-theme-neutral-gray dark:text-theme-neutral-light">
                      <li>• "How do I reset my password?"</li>
                      <li>• "I need to contact support"</li>
                      <li>• "Feature X is not working"</li>
                      <li>• "Connect me to a human agent"</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-theme-neutral-light dark:bg-theme-neutral-gray p-4 rounded-lg">
                  <h4 className="font-semibold text-theme-primary-main mb-2">💡 Pro Tips</h4>
                  <ul className="text-sm text-theme-neutral-gray dark:text-theme-neutral-light space-y-1">
                    <li>• The widget remembers your conversation history</li>
                    <li>• Try asking follow-up questions to test context awareness</li>
                    <li>• Test on mobile to see the responsive design</li>
                    <li>• Say "agent" to test the human escalation flow</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Test Tab */}
          <TabsContent value="database" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-theme-primary-main">
                  <Globe className="h-5 w-5" />
                  Database Connection & Schema Test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-theme-neutral-gray dark:text-theme-neutral-light mb-6">
                  Database test component is not available. Please check your installation or contact support.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-theme-neutral-light dark:border-theme-neutral-gray">
          <p className="text-theme-neutral-gray dark:text-theme-neutral-light">
            Ready to integrate? Check out the{' '}
            <a 
              href="/server/README.md" 
              className="text-theme-primary-main hover:text-theme-primary-dark underline"
            >
              server documentation
            </a>{' '}
            for backend setup instructions.
          </p>
        </div>
      </div>

      {/* Chat Widget - Always visible on demo page */}
      <ChatWidget 
        appName="USTP TPCO"
        position="bottom-right"
        className="z-50"
      />
    </div>
  );
};

export default ChatDemo;
