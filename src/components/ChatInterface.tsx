
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { sendMessageToGroq, analyzeText } from '../services/groqService';
import { Mic, Send, RefreshCw, Sparkles, Clock } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface ChatInterfaceProps {
  onVoiceInputRequest?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onVoiceInputRequest }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: "Hello! I'm Mindful Muse powered by Groq AI. How are you feeling today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatMessageTime = (timestamp: Date) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: uuidv4(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Simulate typing delay for more natural feeling
      const typingDelay = Math.max(1000, Math.min(input.length * 30, 2000));
      
      // Analyze the text sentiment first using Groq
      const analysis = await analyzeText(input);
      
      // Get response from Groq
      const response = await sendMessageToGroq([...messages, userMessage]);
      
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

  return (
    <Card className="glass-card w-full max-w-3xl mx-auto shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-medium text-center flex items-center justify-center gap-2">
          <Sparkles className="h-5 w-5 text-mind-blue" />
          Chat with Mindful Muse (Powered by Groq AI)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
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
                      ? 'bg-mind-blue text-white ml-12' 
                      : 'bg-slate-100 text-slate-800 mr-12'
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
      <CardFooter className="border-t p-4">
        <div className="flex w-full gap-2">
          <Textarea
            className="input-field flex-1 resize-none min-h-[60px]"
            placeholder="Type your message here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <div className="flex flex-col gap-2">
            <Button
              className="bg-mind-blue hover:bg-mind-blue/90" 
              size="icon"
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onVoiceInputRequest}
            >
              <Mic className="h-5 w-5 text-mind-purple" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatInterface;
