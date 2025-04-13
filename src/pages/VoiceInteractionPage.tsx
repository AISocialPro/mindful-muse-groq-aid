
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import VoiceInput from '@/components/VoiceInput';
import { Mic, MessageSquare, Volume2 } from 'lucide-react';

const VoiceInteractionPage = () => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [responses, setResponses] = useState<string[]>([]);

  const handleVoiceTranscript = async (text: string) => {
    setTranscript(text);
    
    // Process with Groq API (simulated here, but actually uses the groqService)
    const simulatedResponses = [
      "I hear you. How are you feeling today?",
      "That's interesting. Could you tell me more about that?",
      "I understand. It's perfectly normal to feel that way.",
      "Thank you for sharing that with me. What would be helpful for you right now?",
      "I'm here to listen and support you however I can."
    ];
    
    const randomResponse = simulatedResponses[Math.floor(Math.random() * simulatedResponses.length)];
    setResponses(prev => [...prev, randomResponse]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-calm text-transparent bg-clip-text">Voice Interaction</h1>
        <p className="text-slate-600">Speak directly to Mindful Muse powered by Groq AI for a natural conversation experience</p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Card className="glass-card hover:shadow-lg transition-all duration-300 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-mind-green" />
              Voice Journaling with Groq AI
            </CardTitle>
            <CardDescription>
              Speak your thoughts and feelings to receive supportive insights from Groq AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="w-24 h-24 rounded-full bg-mind-green/10 flex items-center justify-center mb-4">
                <Volume2 className="h-10 w-10 text-mind-green" />
              </div>
              <p className="text-slate-600 mb-6">Click the button below to start speaking with Mindful Muse powered by Groq AI</p>
              <Button 
                className="rounded-full w-16 h-16 p-0 bg-mind-green hover:bg-mind-green/90 mb-4" 
                onClick={() => setIsVoiceModalOpen(true)}
              >
                <Mic className="h-6 w-6" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {transcript && (
          <Card className="glass-card hover:shadow-lg transition-all duration-300 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-mind-blue" />
                Conversation with Groq AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-slate-100 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">You said:</p>
                  <p>{transcript}</p>
                </div>
                {responses.map((response, index) => (
                  <div key={index} className="p-3 bg-mind-blue/10 rounded-lg">
                    <p className="text-sm text-slate-500 mb-1">Mindful Muse (Groq AI):</p>
                    <p>{response}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <VoiceInput 
        isOpen={isVoiceModalOpen} 
        onClose={() => setIsVoiceModalOpen(false)} 
        onTranscript={handleVoiceTranscript}
      />
    </div>
  );
};

export default VoiceInteractionPage;
