
import React from 'react';
import { Mic } from 'lucide-react';

interface MoodActivityProps {
  className?: string;
}

const MoodActivity: React.FC<MoodActivityProps> = ({ className }) => {
  return <Mic className={className} />;
};

export default MoodActivity;
