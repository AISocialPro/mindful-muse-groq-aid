
import React from 'react';
import { FeatureCardProps } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { motion } from 'framer-motion';

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <Card 
        className="glass-card hover:shadow-xl transition-all duration-300 h-full cursor-pointer relative overflow-hidden group"
        onClick={onClick}
      >
        <div className="absolute -right-12 -top-12 w-24 h-24 rounded-full bg-gradient-calm opacity-20 blur-xl group-hover:opacity-40 transition-opacity"></div>
        <div className="absolute -left-12 -bottom-12 w-24 h-24 rounded-full bg-gradient-calm opacity-10 blur-xl group-hover:opacity-30 transition-opacity"></div>
        
        <CardHeader className="pb-2 relative z-10">
          <div className="feature-icon mb-4 w-fit transform group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
            {icon}
          </div>
          <CardTitle className="text-xl font-semibold group-hover:text-mind-blue transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <CardDescription className="text-base text-slate-600">
            {description}
          </CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
