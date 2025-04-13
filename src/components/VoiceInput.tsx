
import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Mic, Square, Volume2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { processVoiceInput } from '../services/groqService';

interface VoiceInputProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscript: (text: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ isOpen, onClose, onTranscript }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.addEventListener('dataavailable', (e) => {
        chunksRef.current.push(e.data);
      });
      
      mediaRecorderRef.current.addEventListener('stop', async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        chunksRef.current = [];
        
        try {
          toast("Processing with Groq AI...");
          const transcript = await processVoiceInput(audioBlob);
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
      
      toast.success("I'm listening...");
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error("I couldn't access your microphone. Please check permissions and try again.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop all audio tracks to release the microphone
      const tracks = mediaRecorderRef.current.stream.getTracks();
      tracks.forEach(track => track.stop());
      
      setIsRecording(false);
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
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

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md glass-card">
        <DialogHeader>
          <DialogTitle className="text-center">Voice Input with Groq AI</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-6">
          {isRecording ? (
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4 relative">
                <Mic className={`h-10 w-10 text-red-500 ${isRecording ? 'animate-pulse' : ''}`} />
                <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-50"></div>
              </div>
              <div className="text-2xl font-mono mb-2">{formatTime(recordingTime)}</div>
              <p className="text-slate-600 mb-4">Recording your message...</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-mind-blue/10 flex items-center justify-center mb-4">
                <Volume2 className="h-10 w-10 text-mind-blue" />
              </div>
              <p className="text-slate-600 mb-4">Click the microphone to start recording</p>
              <div className="flex justify-center gap-2 text-xs text-slate-500 mb-4">
                <AlertCircle className="h-4 w-4" />
                <p>Speak clearly and Groq AI will convert your voice to text</p>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-center">
          {isRecording ? (
            <Button 
              variant="destructive" 
              className="rounded-full w-16 h-16 p-0" 
              onClick={handleStopRecording}
            >
              <Square className="h-6 w-6" />
            </Button>
          ) : (
            <Button 
              className="rounded-full w-16 h-16 p-0 bg-mind-blue hover:bg-mind-blue/90" 
              onClick={handleStartRecording}
            >
              <Mic className="h-6 w-6" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceInput;
