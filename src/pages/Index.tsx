
import React, { useState } from 'react';
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
  Lightbulb 
} from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const handleVoiceInputRequest = () => {
    setIsVoiceModalOpen(true);
  };

  const handleVoiceTranscript = (text: string) => {
    console.log('Voice transcript:', text);
    // In a real implementation, we would send this text to the chat interface
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pb-20">
        <MoodHeader />
        
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
                <ChatInterface onVoiceInputRequest={handleVoiceInputRequest} />
              </div>
            </TabsContent>
            <TabsContent value="image" className="mt-0">
              <div className="glass-card p-2 md:p-4 rounded-2xl">
                <ImageAnalysis />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <VoiceInput 
          isOpen={isVoiceModalOpen} 
          onClose={() => setIsVoiceModalOpen(false)} 
          onTranscript={handleVoiceTranscript}
        />
      </div>
    </div>
  );
};

export default Index;
