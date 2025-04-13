
import React from 'react';
import ImageAnalysis from '@/components/ImageAnalysis';

const ImageAnalysisPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-calm text-transparent bg-clip-text">Image Analysis</h1>
        <p className="text-slate-600">Upload doodles or images that represent your mood for insights powered by Groq AI</p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <ImageAnalysis />
      </div>
    </div>
  );
};

export default ImageAnalysisPage;
