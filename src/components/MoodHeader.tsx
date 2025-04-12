
import React from 'react';
import { Heart, Sparkles, Sun, Moon, Cloud } from 'lucide-react';

interface MoodHeaderProps {
  userName?: string;
}

const MoodHeader: React.FC<MoodHeaderProps> = ({ userName = '' }) => {
  const greeting = getGreeting();
  const userGreeting = userName ? `, ${userName}` : '';
  const { icon: TimeIcon, greeting: timeGreeting } = getTimeBasedGreeting();

  return (
    <header className="py-8 px-4 text-center slide-up relative">
      <div className="absolute top-12 left-1/4 opacity-20 blur-xl w-32 h-32 bg-mind-pink rounded-full -z-10 animate-pulse-soft"></div>
      <div className="absolute bottom-0 right-1/4 opacity-20 blur-xl w-40 h-40 bg-mind-blue rounded-full -z-10"></div>
      
      <div className="flex justify-center items-center gap-3 mb-4">
        <div className="relative">
          <Heart className="h-8 w-8 text-mind-pink float" fill="#F8C8DC" />
          <Sparkles className="absolute -right-2 -top-2 h-4 w-4 text-mind-yellow animate-pulse-soft" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-calm text-transparent bg-clip-text">
          Mindful Muse
        </h1>
      </div>
      <p className="text-xl text-slate-600 mt-2 font-medium flex items-center justify-center gap-2">
        <TimeIcon className="h-5 w-5 text-mind-yellow" />
        {timeGreeting}{userGreeting}
      </p>
      <div className="max-w-md mx-auto mt-4">
        <p className="text-slate-500">Your AI companion for mental wellness and emotional support</p>
        <p className="text-sm text-mind-purple/80 mt-2 italic">"{getRandomAffirmation()}"</p>
      </div>
    </header>
  );
};

function getGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return { 
      icon: Sun, 
      greeting: "Good morning"
    };
  } else if (hour < 18) {
    return { 
      icon: Cloud, 
      greeting: "Good afternoon"
    };
  } else {
    return { 
      icon: Moon, 
      greeting: "Good evening"
    };
  }
}

function getRandomAffirmation() {
  const affirmations = [
    "You are enough, just as you are.",
    "Every day is a fresh start.",
    "Your feelings are valid and worthy of compassion.",
    "You have the strength to overcome today's challenges.",
    "Small steps forward are still progress.",
    "You deserve kindness, especially from yourself.",
    "It's okay to take time for self-care.",
    "You are not defined by your struggles.",
    "This moment is yours to experience fully.",
    "Breathe deeply; you are present and aware."
  ];
  
  return affirmations[Math.floor(Math.random() * affirmations.length)];
}

export default MoodHeader;
