import { Message, GroqResponse, ImageAnalysis, TextAnalysis } from '../types';

// This would be replaced with an actual API key in a real implementation
// In a production environment, this should be stored securely
const GROQ_API_KEY = "YOUR_GROQ_API_KEY";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const sendMessageToGroq = async (messages: Message[]): Promise<GroqResponse> => {
  try {
    // Since we don't have an actual API key, we'll simulate responses
    // In a real implementation, this would be a fetch call to the Groq API
    
    // Format messages for simulation
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Get the last user message
    const lastUserMessage = formattedMessages
      .filter(msg => msg.role === 'user')
      .pop()?.content.toLowerCase() || '';

    // Simulate API response based on user input
    let responseText = "I'm here to help with your mental wellbeing. How are you feeling today?";
    
    if (lastUserMessage.includes('sad') || lastUserMessage.includes('depress') || lastUserMessage.includes('down')) {
      responseText = "I'm sorry to hear you're feeling down. Remember that it's okay to not be okay sometimes. Would you like to talk more about what's troubling you, or perhaps try a quick mindfulness exercise?";
    } else if (lastUserMessage.includes('anxious') || lastUserMessage.includes('stress') || lastUserMessage.includes('worried')) {
      responseText = "Anxiety can be challenging. Try taking a few deep breaths with me - breathe in for 4 counts, hold for 4, and exhale for 6. This can help activate your parasympathetic nervous system and bring some calm.";
    } else if (lastUserMessage.includes('happy') || lastUserMessage.includes('good') || lastUserMessage.includes('great')) {
      responseText = "I'm glad to hear you're doing well! It's wonderful to celebrate these positive moments. What's been contributing to your good mood lately?";
    } else if (lastUserMessage.includes('tired') || lastUserMessage.includes('exhausted') || lastUserMessage.includes('sleep')) {
      responseText = "Rest is so important for our mental health. Are you getting enough quality sleep? Sometimes establishing a calming bedtime routine can help improve sleep quality.";
    } else if (lastUserMessage.includes('hello') || lastUserMessage.includes('hi') || lastUserMessage.includes('hey')) {
      responseText = "Hello! I'm Mindful Muse, your AI companion for mental wellness. How are you feeling today?";
    } else if (lastUserMessage.includes('bye') || lastUserMessage.includes('goodbye')) {
      responseText = "Take care! Remember to be kind to yourself. I'm here whenever you need to talk.";
    } else if (lastUserMessage.includes('help') || lastUserMessage.includes('support')) {
      responseText = "I'm here to support you. We can chat about your feelings, try some mindfulness exercises, or I can offer some gentle suggestions. What would be most helpful right now?";
    } else if (lastUserMessage.includes('thank')) {
      responseText = "You're very welcome! I'm glad I could be of help.";
    } else if (lastUserMessage) {
      // For any other input, provide a thoughtful response
      responseText = "Thank you for sharing that with me. Your feelings and experiences are valid. Would you like to explore this topic further, or perhaps try a different approach to support your wellbeing today?";
    }

    return {
      text: responseText
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
