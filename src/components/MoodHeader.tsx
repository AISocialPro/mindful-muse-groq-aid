
import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

interface MoodHeaderProps {
  userName?: string;
}

const MoodHeader: React.FC<MoodHeaderProps> = ({ userName = '' }) => {
  const greeting = getGreeting();
  const userGreeting = userName ? `, ${userName}` : '';

  return (
    <header className="py-8 px-4 text-center slide-up relative">
      <div className="absolute top-12 left-1/4 opacity-20 blur-xl w-32 h-32 bg-mind-pink rounded-full -z-10"></div>
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
      <p className="text-xl text-slate-600 mt-2 font-medium">{greeting}{userGreeting}</p>
      <div className="max-w-md mx-auto mt-4">
        <p className="text-slate-500">Your AI companion for mental wellness and emotional support</p>
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

export default MoodHeader;
