
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { ImageAnalysis as ImageAnalysisType } from '../types';
import { analyzeImage } from '../services/groqService';
import { ImageIcon, Upload, RefreshCw, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const ImageAnalysis: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ImageAnalysisType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size - 5MB limit
      if (file.size > 5 * 1024 * 1024) {
        toast.error("The image is too large. Please select an image under 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const base64 = event.target.result.toString().split(',')[1];
          setSelectedImage(event.target.result.toString());
          analyzeUploadedImage(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const analyzeUploadedImage = async (base64: string) => {
    setIsLoading(true);
    setAnalysis(null);
    
    try {
      const result = await analyzeImage(base64);
      setAnalysis(result);
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error("I had trouble analyzing that image. Maybe try another one?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-center">
          <div className="flex justify-center items-center gap-2">
            <ImageIcon className="h-5 w-5 text-mind-green" />
            <span>Image Analysis</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center mb-4 text-slate-600">
          Upload a drawing, doodle, or any image that represents your mood
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            
            <div 
              className={`w-full aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 
                ${selectedImage ? 'border-mind-green' : 'border-slate-300'} 
                ${isLoading ? 'opacity-50' : 'opacity-100'}`}
            >
              {selectedImage ? (
                <img 
                  src={selectedImage} 
                  alt="Selected" 
                  className="max-h-full object-contain rounded-lg" 
                />
              ) : (
                <div className="text-center p-8">
                  <ImageIcon className="mx-auto h-10 w-10 text-slate-400 mb-4" />
                  <p className="text-sm text-slate-500">
                    Upload an image that represents your current mood or emotional state
                  </p>
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleButtonClick}
              className="mt-4 bg-mind-green hover:bg-mind-green/90"
              disabled={isLoading}
            >
              <Upload className="h-5 w-5 mr-2" />
              {selectedImage ? 'Choose Another Image' : 'Upload Image'}
            </Button>
          </div>
          
          <div className="bg-white/40 p-4 rounded-xl min-h-[200px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <RefreshCw className="h-8 w-8 text-mind-purple animate-spin mb-4" />
                <p className="text-slate-600">Analyzing your image...</p>
              </div>
            ) : analysis ? (
              <div className="fade-in">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-mind-yellow" />
                  <h3 className="font-semibold text-lg">Analysis Results</h3>
                </div>
                <p className="mb-2"><span className="font-medium">Mood:</span> {analysis.mood}</p>
                <p className="mb-4 text-slate-600">{analysis.description}</p>
                
                {analysis.suggestions.length > 0 && (
                  <>
                    <h4 className="font-medium mb-2">Suggestions:</h4>
                    <ul className="list-disc list-inside text-slate-600 space-y-1">
                      {analysis.suggestions.map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ) : selectedImage ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <p>Analysis will appear here</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <p>Upload an image to see the analysis</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImageAnalysis;
