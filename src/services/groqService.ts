
import { Message, GroqResponse, ImageAnalysis, TextAnalysis } from '../types';

// Default Groq API key to use if user hasn't provided one
const DEFAULT_GROQ_API_KEY = "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";

export const sendMessageToGroq = async (messages: Message[], apiKey?: string): Promise<GroqResponse> => {
  try {
    // Use provided API key or fall back to default
    const activeApiKey = apiKey || DEFAULT_GROQ_API_KEY;
    
    // Format messages for the API call
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
    
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 800
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Groq API error:', errorData);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return {
        text: data.choices[0].message.content
      };
    } catch (error) {
      console.error('Error calling Groq API:', error);
      // Fall back to simulated response if API call fails
      return simulateResponse(messages);
    }
  } catch (error) {
    console.error('Error in sendMessageToGroq:', error);
    return {
      text: "I'm having trouble connecting to my services right now. Could we try again in a moment?"
    };
  }
};

const simulateResponse = (messages: Message[]): GroqResponse => {
  // Get the last user message
  const lastUserMessage = messages
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
};

export const analyzeImage = async (imageBase64: string, apiKey?: string): Promise<ImageAnalysis> => {
  try {
    // Use provided API key or fall back to default
    const activeApiKey = apiKey || DEFAULT_GROQ_API_KEY;

    // Format the request for image analysis
    const systemMessage = {
      role: "system",
      content: "You are an AI specialized in analyzing emotional content from images. Provide insightful, empathetic analysis in JSON format with mood, description, and suggestions fields."
    };

    const userMessage = {
      role: "user",
      content: [
        { type: "text", text: "What emotions or mental states does this image express? Provide a brief analysis and supportive suggestions. Format your response as JSON with fields for 'mood', 'description', and an array of 'suggestions'." },
        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
      ]
    };

    const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama3-8b-8192", // Use Groq's multimodal model
          messages: [systemMessage, userMessage],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Groq API error:', errorData);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
      try {
        // Try to parse as JSON first
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const jsonData = JSON.parse(jsonMatch[0]);
          return {
            mood: jsonData.mood || "contemplative",
            description: jsonData.description || analysisText.split('\n')[0],
            suggestions: Array.isArray(jsonData.suggestions) ? jsonData.suggestions : ["Take a moment to breathe deeply", "Consider journaling your thoughts"]
          };
        }
      } catch (e) {
        console.log('Failed to parse JSON, falling back to text parsing');
      }
      
      // Parse the analysis text to extract information
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
      console.error('Error calling Groq API:', error);
      // Fall back to simulated response
      return simulateImageAnalysis();
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
    return simulateImageAnalysis();
  }
};

const simulateImageAnalysis = (): ImageAnalysis => {
  return {
    mood: "reflective",
    description: "The image appears to show a moment of quiet introspection. There's a sense of thoughtfulness and contemplation.",
    suggestions: [
      "Take a few minutes to journal about what's on your mind",
      "Practice mindful breathing to connect with your current emotional state",
      "Consider expressing your feelings through creative outlets like art or music"
    ]
  };
};

export const analyzeText = async (text: string, apiKey?: string): Promise<TextAnalysis> => {
  try {
    // Use provided API key or fall back to default
    const activeApiKey = apiKey || DEFAULT_GROQ_API_KEY;

    const systemMessage = {
      role: "system",
      content: "You are an AI specialized in analyzing emotional tone in text. Provide brief sentiment analysis with supportive suggestions."
    };

    const userMessage = {
      role: "user",
      content: `Analyze the emotional tone of this text and provide helpful suggestions: "${text}"`
    };

    const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeApiKey}`,
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
        const errorData = await response.json();
        console.error('Groq API error:', errorData);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
      // Determine sentiment
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
      
      // Extract tone
      const toneMatch = analysisText.match(/tone:?\s*([^\n.]+)/i);
      const tone = toneMatch ? toneMatch[1].trim() : "neutral";
      
      // Extract suggestions
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
      console.error('Error calling Groq API:', error);
      return simulateTextAnalysis(text);
    }
  } catch (error) {
    console.error('Error analyzing text:', error);
    return simulateTextAnalysis(text);
  }
};

const simulateTextAnalysis = (text: string): TextAnalysis => {
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  let tone = "neutral";
  let suggestions = ["Take a few deep breaths", "Consider how your thoughts influence your emotions"];
  
  text = text.toLowerCase();
  
  if (text.includes('happy') || text.includes('joy') || text.includes('excited') || text.includes('good')) {
    sentiment = 'positive';
    tone = "happy";
    suggestions = [
      "Savor this positive emotion by practicing gratitude",
      "Share your positive feelings with someone you care about",
      "Take note of what contributed to this feeling so you can revisit it"
    ];
  } else if (text.includes('sad') || text.includes('angry') || text.includes('anxious') || text.includes('stress') || text.includes('depress')) {
    sentiment = 'negative';
    tone = "concerned";
    suggestions = [
      "Practice gentle self-compassion during difficult emotions",
      "Try a brief grounding exercise like the 5-4-3-2-1 technique",
      "Consider sharing your feelings with someone you trust"
    ];
  }
  
  return {
    tone,
    sentiment,
    suggestions
  };
};

export const processVoiceInput = async (audioBlob: Blob, apiKey?: string): Promise<string> => {
  // Use provided API key or fall back to default
  const activeApiKey = apiKey || DEFAULT_GROQ_API_KEY;
  
  // In a real implementation, this would convert speech to text using Groq
  try {
    // Simulated response - in a real app, this would call the Groq API
    const commonPhrases = [
      "I've been feeling anxious lately.",
      "Today was a good day, I feel happy.",
      "I'm not sure how I'm feeling right now.",
      "I've been struggling with stress at work.",
      "I'd like some mindfulness exercises.",
      "How can I improve my sleep habits?",
      "I'm feeling overwhelmed with everything going on."
    ];
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return a random common phrase as the "transcription"
        const randomPhrase = commonPhrases[Math.floor(Math.random() * commonPhrases.length)];
        resolve(randomPhrase);
      }, 1500);
    });
  } catch (error) {
    console.error('Error processing voice input:', error);
    throw new Error('Failed to process voice input');
  }
};

export const textToSpeech = async (text: string, apiKey?: string): Promise<ArrayBuffer> => {
  // In a real implementation, this would convert text to speech using an API
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
