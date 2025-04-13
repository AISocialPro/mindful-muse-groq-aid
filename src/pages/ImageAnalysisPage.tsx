
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ImageAnalysis from '@/components/ImageAnalysis';
import { Image as ImageIcon, PencilLine, Camera, FileImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ImageAnalysisPage = () => {
  const examples = [
    { title: "Doodle", description: "Upload a simple doodle that represents your feelings", icon: <PencilLine className="h-5 w-5" /> },
    { title: "Photo", description: "Share a photo that captures your mood", icon: <Camera className="h-5 w-5" /> },
    { title: "Artwork", description: "Upload art that resonates with your emotions", icon: <FileImage className="h-5 w-5" /> }
  ];
  
  const handleExampleClick = (example: string) => {
    toast.info(`Try uploading a ${example.toLowerCase()}`, {
      description: "Upload any image that represents how you're feeling",
      duration: 5000
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-calm text-transparent bg-clip-text">Image Analysis</h1>
        <p className="text-slate-600">Upload doodles or images that represent your mood for insights powered by Groq AI</p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Examples of what you can share</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {examples.map((example, index) => (
              <Card key={index} className="hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer" onClick={() => handleExampleClick(example.title)}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {example.icon}
                    <span>{example.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{example.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="glass-card p-6 rounded-2xl mb-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-medium mb-2">Why share images?</h3>
            <p className="text-slate-600">Images can express emotions that are difficult to put into words. Our Groq AI analysis helps you understand your feelings better through visual expressions.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl hover:bg-white/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-mind-green/20 flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="h-6 w-6 text-mind-green" />
              </div>
              <h4 className="font-medium mb-1">Express Yourself</h4>
              <p className="text-sm text-slate-600">Upload any image that reflects your current emotions</p>
            </div>
            
            <div className="p-4 rounded-xl hover:bg-white/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-mind-blue/20 flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="h-6 w-6 text-mind-blue" />
              </div>
              <h4 className="font-medium mb-1">Gain Insights</h4>
              <p className="text-sm text-slate-600">Receive personalized analysis of your emotional state</p>
            </div>
            
            <div className="p-4 rounded-xl hover:bg-white/50 transition-colors">
              <div className="w-12 h-12 rounded-full bg-mind-yellow/20 flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="h-6 w-6 text-mind-yellow" />
              </div>
              <h4 className="font-medium mb-1">Track Progress</h4>
              <p className="text-sm text-slate-600">Monitor changes in your emotional wellbeing over time</p>
            </div>
          </div>
        </div>
        
        <ImageAnalysis />
      </div>
    </div>
  );
};

export default ImageAnalysisPage;
