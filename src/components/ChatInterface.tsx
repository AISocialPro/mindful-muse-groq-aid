import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Mic, Send, RefreshCw, Sparkles, Clock, HelpCircle, MessageSquare, Key, Settings } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface ChatInterfaceProps {
  onVoiceInputRequest?: () => void;
  apiKey?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onVoiceInputRequest, apiKey }) => {
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [groqApiKey, setGroqApiKey] = useState<string>(() => localStorage.getItem('groq_api_key') || '');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "I've been feeling anxious lately",
    "How can I practice mindfulness?",
    "I need some self-care ideas",
    "What are some ways to reduce stress?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveApiKey = () => {
    localStorage.setItem('groq_api_key', groqApiKey);
    setIsApiKeyDialogOpen(false);
    toast.success("API key saved!");
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

    try {
      const activeApiKey =
        apiKey ||
        groqApiKey ||
        "YOUR_GROQ_API_KEY"; 

      if (!activeApiKey) {
        toast.error("API key missing!");
        return;
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${activeApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();

      const aiMessage: Message = {
        id: uuidv4(),
        content: data?.choices?.[0]?.message?.content || "No response",
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error(error);
      toast.error("Groq error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sparkles /> Mindful Muse
        </CardTitle>
        <Button onClick={() => setIsApiKeyDialogOpen(true)}>
          <Settings />
        </Button>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[400px]">
          {messages.map(msg => (
            <div key={msg.id} className={`my-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div className="p-2 rounded bg-gray-100 inline-block">
                {msg.content}
                <div className="text-xs opacity-50">
                  {formatDistanceToNow(msg.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {isLoading && <div>Thinking...</div>}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} />
        <Button onClick={() => handleSendMessage()}>
          <Send />
        </Button>
      </CardFooter>

      <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set API Key</DialogTitle>
            <DialogDescription>Enter Groq key</DialogDescription>
          </DialogHeader>

          <Input
            type="password"
            value={groqApiKey}
            onChange={(e) => setGroqApiKey(e.target.value)}
          />

          <DialogFooter>
            <Button onClick={saveApiKey}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ChatInterface;
