
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ImageAnalysis {
  mood: string;
  description: string;
  suggestions: string[];
}

export interface TextAnalysis {
  tone: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  suggestions: string[];
}

export interface GroqResponse {
  text: string;
  analysis?: TextAnalysis;
}

export interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}
