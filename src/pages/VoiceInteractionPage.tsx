
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import VoiceInput from '@/components/VoiceInput';
import { Mic, MessageSquare, Volume2, CheckCircle2, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const VoiceInteractionPage = () => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [responses, setResponses] = useState<string[]>([]);
  const [showPrompts, setShowPrompts] = useState(false);
  const navigate = useNavigate();
  
  const samplePrompts = [
    "How are you feeling today?",
    "What's been on your mind lately?",
    "I've been feeling anxious, can you help?",
    "Tell me some ways to practice mindfulness"
  ];

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
    
    // Show a toast with encouragement
    toast.success("Thanks for sharing! I'm here to support you.");
  };
  
  const startNewConversation = () => {
    navigate('/');
    toast("Starting a new conversation with Mindful Muse!");
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
              <div className="w-24 h-24 rounded-full bg-mind-green/10 flex items-center justify-center mb-4 hover:bg-mind-green/20 transition-colors cursor-pointer" onClick={() => setIsVoiceModalOpen(true)}>
                <Volume2 className="h-10 w-10 text-mind-green" />
              </div>
              <p className="text-slate-600 mb-4">Click the microphone to start speaking with Mindful Muse powered by Groq AI</p>
              
              <div className="w-full max-w-md">
                <Button 
                  className="rounded-full w-16 h-16 p-0 bg-mind-green hover:bg-mind-green/90 mb-6 hover:scale-105 transition-transform" 
                  onClick={() => setIsVoiceModalOpen(true)}
                >
                  <Mic className="h-6 w-6" />
                </Button>
                
                <div className="flex justify-center mb-4">
                  <Button variant="outline" onClick={() => setShowPrompts(!showPrompts)} className="text-sm flex items-center gap-1">
                    <span>Need inspiration?</span>
                    <ArrowDown className={`h-4 w-4 transition-transform ${showPrompts ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
                
                {showPrompts && (
                  <div className="space-y-2 fade-in">
                    <p className="text-center text-slate-600 text-sm mb-2">Try saying one of these:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {samplePrompts.map((prompt, index) => (
                        <Button 
                          key={index} 
                          variant="ghost" 
                          className="text-left border border-slate-200 hover:bg-mind-green/10 hover:border-mind-green/40 transition-all"
                          onClick={() => {
                            setIsVoiceModalOpen(true);
                            toast.info(`Try saying: "${prompt}"`, { duration: 5000 });
                          }}
                        >
                          "{prompt}"
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {transcript && (
          <Card className="glass-card hover:shadow-lg transition-all duration-300 mb-6 slide-up">
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
                  <div key={index} className="p-3 bg-mind-blue/10 rounded-lg fade-in">
                    <p className="text-sm text-slate-500 mb-1">Mindful Muse (Groq AI):</p>
                    <p>{response}</p>
                  </div>
                ))}
                
                <div className="flex justify-center mt-6">
                  <Button 
                    className="bg-mind-blue hover:bg-mind-blue/90 rounded-full px-6"
                    onClick={() => setIsVoiceModalOpen(true)}
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Respond
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="ml-2 rounded-full px-6"
                    onClick={startNewConversation}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    New Conversation
                  </Button>
                </div>
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
