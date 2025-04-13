
import React, { useState, useEffect } from 'react';
import MoodHeader from '@/components/MoodHeader';
import FeatureCard from '@/components/FeatureCard';
import ChatInterface from '@/components/ChatInterface';
import ImageAnalysis from '@/components/ImageAnalysis';
import VoiceInput from '@/components/VoiceInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageSquare, 
  Image as ImageIcon, 
  Mic, 
  Brain, 
  HeartPulse,
  Lightbulb,
  Key
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const Index = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const [groqApiKey, setGroqApiKey] = useState<string>(() => {
    return localStorage.getItem('groq_api_key') || '';
  });
  const [showApiKeyBanner, setShowApiKeyBanner] = useState(false);

  useEffect(() => {
    // Check if API key is set
    const hasApiKey = Boolean(localStorage.getItem('groq_api_key'));
    setShowApiKeyBanner(!hasApiKey);
  }, [groqApiKey]);

  const handleVoiceInputRequest = () => {
    if (!groqApiKey) {
      setIsApiKeyDialogOpen(true);
      toast.info("Please set your Groq API key first to use voice features");
    } else {
      setIsVoiceModalOpen(true);
    }
  };

  const handleVoiceTranscript = (text: string) => {
    console.log('Voice transcript:', text);
    // In a real implementation, we would send this text to the chat interface
  };

  const saveApiKey = () => {
    localStorage.setItem('groq_api_key', groqApiKey);
    setIsApiKeyDialogOpen(false);
    setShowApiKeyBanner(false);
    toast.success("API key saved successfully!", {
      description: "Your Groq API key has been saved for this session"
    });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pb-20">
        <MoodHeader />
        
        {showApiKeyBanner && (
          <div className="glass-card p-4 rounded-xl mb-6 border border-amber-200 bg-amber-50/70">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-100">
                <Key className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-amber-800">Set up your Groq API key</h3>
                <p className="text-sm text-amber-700">To use AI features, you'll need to provide a Groq API key</p>
              </div>
              <Button 
                variant="secondary" 
                className="bg-white hover:bg-white/80"
                onClick={() => setIsApiKeyDialogOpen(true)}
              >
                Add Key
              </Button>
            </div>
          </div>
        )}
        
        <div className="max-w-4xl mx-auto my-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <FeatureCard
              title="AI Chat Support"
              description="Talk to Mindful Muse about your feelings, get advice, or simply chat."
              icon={<MessageSquare className="h-5 w-5" />}
              onClick={() => setActiveTab('chat')}
            />
            <FeatureCard
              title="Image Analysis"
              description="Upload doodles or images that represent your mood for insightful analysis."
              icon={<ImageIcon className="h-5 w-5" />}
              onClick={() => setActiveTab('image')}
            />
            <FeatureCard
              title="Voice Interaction"
              description="Speak directly to Mindful Muse for a more natural conversation experience."
              icon={<Mic className="h-5 w-5" />}
              onClick={handleVoiceInputRequest}
            />
          </div>
          
          <div className="glass-card p-6 rounded-2xl mb-8 transform hover:scale-[1.01] transition-transform">
            <h2 className="text-xl font-semibold text-center mb-6">How Mindful Muse Helps You</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center p-4 hover:bg-white/50 rounded-xl transition-colors">
                <div className="p-3 rounded-full bg-mind-blue/20 mb-3">
                  <Brain className="h-5 w-5 text-mind-blue" />
                </div>
                <h3 className="font-medium mb-1">Emotional Analysis</h3>
                <p className="text-sm text-slate-600">Understand your feelings through conversation and image analysis</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 hover:bg-white/50 rounded-xl transition-colors">
                <div className="p-3 rounded-full bg-mind-green/20 mb-3">
                  <HeartPulse className="h-5 w-5 text-mind-green" />
                </div>
                <h3 className="font-medium mb-1">Wellness Support</h3>
                <p className="text-sm text-slate-600">Get personalized suggestions to improve your mental wellbeing</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 hover:bg-white/50 rounded-xl transition-colors">
                <div className="p-3 rounded-full bg-mind-yellow/20 mb-3">
                  <Lightbulb className="h-5 w-5 text-mind-yellow" />
                </div>
                <h3 className="font-medium mb-1">Mindfulness Tips</h3>
                <p className="text-sm text-slate-600">Learn techniques to stay present and reduce stress</p>
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6 p-1">
              <TabsTrigger value="chat" className="data-[state=active]:bg-mind-blue data-[state=active]:text-white">
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="image" className="data-[state=active]:bg-mind-green data-[state=active]:text-white">
                <ImageIcon className="h-4 w-4 mr-2" />
                Image Analysis
              </TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="mt-0">
              <div className="glass-card p-2 md:p-4 rounded-2xl">
                <ChatInterface 
                  onVoiceInputRequest={handleVoiceInputRequest} 
                  apiKey={groqApiKey}
                />
              </div>
            </TabsContent>
            <TabsContent value="image" className="mt-0">
              <div className="glass-card p-2 md:p-4 rounded-2xl">
                <ImageAnalysis apiKey={groqApiKey} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <VoiceInput 
          isOpen={isVoiceModalOpen} 
          onClose={() => setIsVoiceModalOpen(false)} 
          onTranscript={handleVoiceTranscript}
        />
        
        <Dialog open={isApiKeyDialogOpen} onOpenChange={setIsApiKeyDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Set your Groq API Key</DialogTitle>
              <DialogDescription>
                Enter your Groq API key to enable AI features.
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
      </div>
    </div>
  );
};

export default Index;
