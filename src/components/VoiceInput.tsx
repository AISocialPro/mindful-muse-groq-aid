
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Mic, Square, Volume2, AlertCircle, VolumeX, Volume1, Key } from 'lucide-react';
import { toast } from 'sonner';
import { processVoiceInput } from '../services/groqService';

interface VoiceInputProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscript: (text: string) => void;
  apiKey?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ isOpen, onClose, onTranscript, apiKey }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingTips, setRecordingTips] = useState<string[]>([
    "Speak clearly and at a normal pace",
    "Stay close to your microphone",
    "Try to minimize background noise",
    "Speak for at least a few seconds for better results"
  ]);
  const [currentTip, setCurrentTip] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);

  const localApiKey = localStorage.getItem('groq_api_key') || '';
  const effectiveApiKey = apiKey || localApiKey;

  useEffect(() => {
    if (isOpen) {
      // Reset state when opening
      setRecordingTime(0);
      setAudioLevel(0);
      setIsRecording(false);
    }
    
    return () => {
      // Clean up when closing
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      stopMicrophone();
    };
  }, [isOpen]);
  
  useEffect(() => {
    // Cycle through tips during recording
    if (isRecording) {
      const tipInterval = setInterval(() => {
        setCurrentTip(prev => (prev + 1) % recordingTips.length);
      }, 4000);
      
      return () => clearInterval(tipInterval);
    }
  }, [isRecording, recordingTips.length]);

  const stopMicrophone = () => {
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      microphoneStreamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    analyserRef.current = null;
  };

  const handleStartRecording = async () => {
    // Check for API key
    if (!effectiveApiKey) {
      toast.error("Groq API key is required for voice transcription", {
        description: "Please set your API key in settings"
      });
      onClose();
      return;
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneStreamRef.current = stream;
      
      // Set up audio context for visualization
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      // Start visualizing audio levels
      visualizeAudio();
      
      // Set up media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.addEventListener('dataavailable', (e) => {
        chunksRef.current.push(e.data);
      });
      
      mediaRecorderRef.current.addEventListener('stop', async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        chunksRef.current = [];
        
        try {
          toast("Processing your voice with Groq AI...");
          const transcript = await processVoiceInput(audioBlob, effectiveApiKey);
          onTranscript(transcript);
          
          // Close the dialog after successful transcription
          setTimeout(() => {
            onClose();
          }, 500);
        } catch (error) {
          console.error('Error processing voice:', error);
          toast.error("I couldn't process your voice. Please try again or type your message.");
        }
      });
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Set up a timer to show recording duration
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
      
      toast.success("I'm listening to you now...");
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error("I couldn't access your microphone. Please check permissions and try again.");
    }
  };

  const visualizeAudio = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateAudioLevel = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate average value
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      
      // Normalize to 0-100
      const normalized = Math.min(100, Math.max(0, average * 2));
      setAudioLevel(normalized);
      
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    };
    
    updateAudioLevel();
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all audio tracks to release the microphone
      stopMicrophone();
      
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Clear animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      toast("Processing your voice message with Groq AI...");
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDialogClose = () => {
    if (isRecording) {
      handleStopRecording();
    }
    onClose();
  };
  
  const getVolumeIcon = () => {
    if (audioLevel < 20) return <VolumeX className="h-10 w-10 text-red-500" />;
    if (audioLevel < 50) return <Volume1 className="h-10 w-10 text-amber-500" />;
    return <Volume2 className="h-10 w-10 text-green-500" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md glass-card">
        <DialogHeader>
          <DialogTitle className="text-center">Voice Input with Groq AI</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-6">
          {!effectiveApiKey ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Key className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-medium text-amber-800 mb-2">API Key Required</h3>
              <p className="text-sm text-amber-700 mb-4">
                Please set your Groq API key in settings to use voice features
              </p>
              <Button 
                variant="outline" 
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          ) : isRecording ? (
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4 relative"
                   style={{ transform: `scale(${1 + audioLevel/200})` }}>
                {getVolumeIcon()}
                <div 
                  className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-50"
                  style={{ animationDuration: `${1200 - audioLevel * 8}ms` }}
                ></div>
              </div>
              <div className="text-2xl font-mono mb-2">{formatTime(recordingTime)}</div>
              <div className="text-slate-600 mb-4 fade-in h-8">
                <p className="animate-pulse">{recordingTips[currentTip]}</p>
              </div>
              
              <div className="w-full max-w-[200px] h-2 bg-gray-200 rounded-full mb-6">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-100" 
                  style={{ width: `${audioLevel}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-mind-blue/10 flex items-center justify-center mb-4 hover:bg-mind-blue/20 transition-all cursor-pointer" onClick={handleStartRecording}>
                <Volume2 className="h-10 w-10 text-mind-blue" />
              </div>
              <p className="text-slate-600 mb-4">Click the microphone to start recording</p>
              <div className="flex justify-center gap-2 text-xs text-slate-500 mb-4">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p>Speak clearly and Groq AI will convert your voice to text</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-center">
          {isRecording ? (
            <Button 
              variant="destructive" 
              className="rounded-full w-16 h-16 p-0 hover:scale-105 transition-transform" 
              onClick={handleStopRecording}
            >
              <Square className="h-6 w-6" />
            </Button>
          ) : effectiveApiKey ? (
            <Button 
              className="rounded-full w-16 h-16 p-0 bg-mind-blue hover:bg-mind-blue/90 hover:scale-105 transition-transform" 
              onClick={handleStartRecording}
            >
              <Mic className="h-6 w-6" />
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceInput;
