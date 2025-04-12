
import React from 'react';
import { Heart } from 'lucide-react';

interface MoodHeaderProps {
  userName?: string;
}

const MoodHeader: React.FC<MoodHeaderProps> = ({ userName = '' }) => {
  const greeting = getGreeting();
  const userGreeting = userName ? `, ${userName}` : '';

  return (
    <header className="py-6 px-4 text-center slide-up">
      <div className="flex justify-center items-center gap-3 mb-3">
        <Heart className="h-8 w-8 text-mind-pink animate-pulse-soft" fill="#F8C8DC" />
        <h1 className="text-3xl font-bold bg-gradient-calm text-transparent bg-clip-text">
          Mindful Muse
        </h1>
      </div>
      <p className="text-xl text-slate-600 mt-2">{greeting}{userGreeting}</p>
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
