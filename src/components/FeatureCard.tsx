
import React from 'react';
import { FeatureCardProps } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, onClick }) => {
  return (
    <Card 
      className="glass-card hover:shadow-xl transition-all duration-300 h-full cursor-pointer overflow-hidden group"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="feature-icon mb-4 w-fit animate-pulse-soft">
          {icon}
        </div>
        <CardTitle className="text-xl font-semibold group-hover:text-mind-blue transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base text-slate-600">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
