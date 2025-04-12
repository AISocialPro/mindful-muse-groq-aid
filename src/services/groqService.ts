
import { Message, GroqResponse, ImageAnalysis, TextAnalysis } from '../types';

// This would be replaced with an actual API key in a real implementation
// In a production environment, this should be stored securely
const GROQ_API_KEY = "YOUR_GROQ_API_KEY";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const sendMessageToGroq = async (messages: Message[]): Promise<GroqResponse> => {
  try {
    // Format messages for the API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Add system message for context
    const systemMessage = {
      role: "system",
      content: "You are Mindful Muse, a compassionate and supportive AI companion focusing on mental wellbeing. Provide empathetic responses, practical advice, and gentle encouragement. Keep responses concise and supportive."
    };

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [systemMessage, ...formattedMessages],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      text: data.choices[0].message.content
    };
  } catch (error) {
    console.error('Error communicating with Groq:', error);
    return {
      text: "I'm having trouble connecting to my services right now. Could we try again in a moment?"
    };
  }
};

export const analyzeImage = async (imageBase64: string): Promise<ImageAnalysis> => {
  try {
    // Format the request for image analysis
    const systemMessage = {
      role: "system",
      content: "You are an AI specialized in analyzing emotional content from images. Provide insightful, empathetic analysis."
    };

    const userMessage = {
      role: "user",
      content: [
        { type: "text", text: "What emotions or mental states does this image express? Provide a brief analysis and supportive suggestions." },
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
      ]
    };

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Replace with Groq's multimodal model
        messages: [systemMessage, userMessage],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    // Parse the analysis text to extract information
    // This is a simplified version, in a real app we might want more structure
    const moodMatch = analysisText.match(/mood:?\s*([^\n.]+)/i);
    const mood = moodMatch ? moodMatch[1].trim() : "contemplative";
    
    // Extract suggestions (simplified)
    const suggestions = analysisText
      .split(/suggestions?:?/i)[1]?.split(/\d+\.|\n-|\*/)
      .filter(Boolean)
      .map(s => s.trim())
      .filter(s => s.length > 0) || ["Take a moment to breathe deeply", "Consider journaling your thoughts"];

    return {
      mood,
      description: analysisText.split('\n')[0],
      suggestions
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    return {
      mood: "unclear",
      description: "I couldn't properly analyze this image at the moment.",
      suggestions: ["Try uploading a different image", "Consider describing your feelings in text instead"]
    };
  }
};

export const analyzeText = async (text: string): Promise<TextAnalysis> => {
  try {
    const systemMessage = {
      role: "system",
      content: "You are an AI specialized in analyzing emotional tone in text. Provide brief sentiment analysis with supportive suggestions."
    };

    const userMessage = {
      role: "user",
      content: `Analyze the emotional tone of this text and provide helpful suggestions: "${text}"`
    };

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [systemMessage, userMessage],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    // Determine sentiment (simplified logic)
    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    if (analysisText.toLowerCase().includes('positive') || 
        analysisText.toLowerCase().includes('happy') || 
        analysisText.toLowerCase().includes('joy')) {
      sentiment = 'positive';
    } else if (analysisText.toLowerCase().includes('negative') || 
               analysisText.toLowerCase().includes('sad') || 
               analysisText.toLowerCase().includes('anxious')) {
      sentiment = 'negative';
    }
    
    // Extract tone (simplified)
    const toneMatch = analysisText.match(/tone:?\s*([^\n.]+)/i);
    const tone = toneMatch ? toneMatch[1].trim() : "neutral";
    
    // Extract suggestions (simplified)
    const suggestions = analysisText
      .split(/suggestions?:?/i)[1]?.split(/\d+\.|\n-|\*/)
      .filter(Boolean)
      .map(s => s.trim())
      .filter(s => s.length > 0) || ["Take a few deep breaths", "Consider how your thoughts influence your emotions"];

    return {
      tone,
      sentiment,
      suggestions
    };
  } catch (error) {
    console.error('Error analyzing text:', error);
    return {
      tone: "unclear",
      sentiment: "neutral",
      suggestions: ["Try expressing your thoughts differently", "Consider speaking with the AI companion"]
    };
  }
};

export const processVoiceInput = async (audioBlob: Blob): Promise<string> => {
  // In a real implementation, this would convert speech to text
  // Here we're mocking the functionality
  try {
    // This would be replaced with actual speech-to-text conversion using Groq or other API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("This is a placeholder for speech-to-text conversion");
      }, 1000);
    });
  } catch (error) {
    console.error('Error processing voice input:', error);
    throw new Error('Failed to process voice input');
  }
};

export const textToSpeech = async (text: string): Promise<ArrayBuffer> => {
  // In a real implementation, this would convert text to speech
  // Here we're mocking the functionality
  try {
    // This would be replaced with actual text-to-speech conversion
    return new Promise((resolve) => {
      // Mocked response - in reality this would be audio data
      const mockAudioData = new ArrayBuffer(128);
      setTimeout(() => {
        resolve(mockAudioData);
      }, 500);
    });
  } catch (error) {
    console.error('Error converting text to speech:', error);
    throw new Error('Failed to convert text to speech');
  }
};
