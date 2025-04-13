
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { sendMessageToGroq, analyzeText } from '../services/groqService';
import { Mic, Send, RefreshCw, Sparkles, Clock, HelpCircle, MessageSquare, Key, Settings } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ChatInterfaceProps {
  onVoiceInputRequest?: () => void;
  apiKey?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onVoiceInputRequest, apiKey }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: "Hello! I'm Mindful Muse powered by Groq AI. How are you feeling today? You can type your response or click the microphone icon to speak.",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [groqApiKey, setGroqApiKey] = useState<string>(() => {
    return localStorage.getItem('groq_api_key') || '';
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const suggestedPrompts = [
    "I've been feeling anxious lately",
    "How can I practice mindfulness?",
    "I need some self-care ideas",
    "What are some ways to reduce stress?"
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageTime = (timestamp: Date) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  const saveApiKey = () => {
    localStorage.setItem('groq_api_key', groqApiKey);
    setIsApiKeyDialogOpen(false);
    toast.success("API key saved successfully!", {
      description: "Your Groq API key has been saved for this session"
    });
  };

  const handleSendMessage = async (text?: string) => {
    const messageToSend = text || input;
    if (!messageToSend.trim()) return;
    
    const userMessage: Message = {
      id: uuidv4(),
      content: messageToSend,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowSuggestions(false);
    
    try {
      // Check if API key is available
      const activeApiKey = apiKey || groqApiKey;
      if (!activeApiKey) {
        toast.error("Please set your Groq API key in settings", {
          description: "Click the settings icon to add your API key"
        });
      }
      
      // Simulate typing delay for more natural feeling
      const typingDelay = Math.max(1000, Math.min(messageToSend.length * 30, 2000));
      
      // Analyze the text sentiment first using Groq
      const analysis = await analyzeText(messageToSend, activeApiKey);
      
      // Get response from Groq
      const response = await sendMessageToGroq([...messages, userMessage], activeApiKey);
      
      // Artificial delay to simulate typing
      await new Promise(resolve => setTimeout(resolve, typingDelay));
      
      const aiMessage: Message = {
        id: uuidv4(),
        content: response.text,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // If the sentiment is negative, offer additional support
      if (analysis.sentiment === 'negative') {
        toast("I noticed you might be feeling down. Remember to be kind to yourself.", {
          description: "Would you like some self-care suggestions?",
          action: {
            label: "Yes, please",
            onClick: () => {
              const suggestion = analysis.suggestions[0] || 
                "Try taking a few deep breaths and remember that difficult feelings are temporary.";
              
              const supportMessage: Message = {
                id: uuidv4(),
                content: `Here's a suggestion that might help: ${suggestion}`,
                role: 'assistant',
                timestamp: new Date()
              };
              
              setMessages(prev => [...prev, supportMessage]);
            }
          }
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("I'm having trouble connecting to Groq AI. Please try again in a moment.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="glass-card w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="border-b flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-medium text-center flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-mind-blue" />
          Chat with Mindful Muse (Powered by Groq AI)
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="hover:bg-slate-100"
          onClick={() => setIsApiKeyDialogOpen(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {(!apiKey && !groqApiKey) && (
          <div className="bg-amber-50 border-b border-amber-200 p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Key className="h-5 w-5 text-amber-500" />
              <p className="font-medium text-amber-700">API Key Required</p>
            </div>
            <p className="text-sm text-amber-600 mb-2">Please set your Groq API key to enable full chat functionality.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-amber-700 border-amber-300 bg-amber-50 hover:bg-amber-100"
              onClick={() => setIsApiKeyDialogOpen(true)}
            >
              <Key className="h-4 w-4 mr-2" />
              Set API Key
            </Button>
          </div>
        )}
        
        <ScrollArea className="h-[400px] px-4">
          <div className="space-y-4 py-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} fade-in`}
              >
                <div 
                  className={`rounded-2xl px-4 py-3 max-w-[80%] ${
                    message.role === 'user' 
                      ? 'bg-mind-blue text-white ml-12 hover:shadow-md transition-shadow' 
                      : 'bg-slate-100 text-slate-800 mr-12 hover:shadow-sm transition-shadow'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="mb-1">{message.content}</div>
                    <div className="text-xs opacity-70 flex items-center mt-1">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {formatMessageTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start fade-in">
                <div className="rounded-2xl px-4 py-3 bg-slate-100 text-slate-800">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Groq AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4 flex-col">
        {showSuggestions && (
          <div className="grid grid-cols-2 gap-2 w-full mb-3 fade-in">
            {suggestedPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left h-auto py-2 text-sm justify-start hover:bg-mind-blue/10 hover:border-mind-blue/30"
                onClick={() => handleSendMessage(prompt)}
              >
                <MessageSquare className="h-3 w-3 mr-2 flex-shrink-0" />
                <span className="truncate">{prompt}</span>
              </Button>
            ))}
          </div>
        )}
        
        <div className="flex w-full gap-2">
          <Textarea
            className="input-field flex-1 resize-none min-h-[60px]"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex flex-col gap-2">
            <Button
              className="bg-mind-blue hover:bg-mind-blue/90 hover:scale-105 transition-transform" 
              size="icon"
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onVoiceInputRequest}
              className="hover:bg-mind-purple/10 hover:border-mind-purple/30 transition-colors"
            >
              <Mic className="h-5 w-5 text-mind-purple" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="hover:bg-mind-yellow/10 hover:border-mind-yellow/30 transition-colors"
            >
              <HelpCircle className="h-5 w-5 text-mind-yellow" />
            </Button>
          </div>
        </div>
      </CardFooter>
      
      <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Set your Groq API Key</DialogTitle>
            <DialogDescription>
              Enter your Groq API key to enable AI chat features.
              You can get an API key from <a href="https://console.groq.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Groq's website</a>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Input
                type="password"
                placeholder="Enter your Groq API key"
                value={groqApiKey}
                onChange={(e) => setGroqApiKey(e.target.value)}
              />
              <p className="text-xs text-slate-500">Your API key is stored locally and never sent to our servers.</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={saveApiKey} disabled={!groqApiKey.trim()}>
              Save Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ChatInterface;
