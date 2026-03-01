const handleSendMessage = async (text?: string) => {
  const messageToSend = text || input;
  if (!messageToSend.trim()) return;

  const userMessage = {
    id: uuidv4(),
    content: messageToSend,
    role: 'user',
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMessage]);
  setInput('');
  setIsLoading(true);
  setShowSuggestions(false);

  try {
    // ✅ DIRECT API KEY (TEMPORARY USE)
    const activeApiKey =
      apiKey ||
      groqApiKey ||
      "YOUR_NEW_GROQ_API_KEY"; // 👈 YAHAN API KEY DAALNI HAI

    if (!activeApiKey) {
      toast.error("API key missing!", {
        description: "Please add your Groq API key"
      });
      return;
    }

    const typingDelay = Math.max(
      1000,
      Math.min(messageToSend.length * 30, 2000)
    );

    // ✅ API CALL (direct yahi se)
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${activeApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            ...messages,
            userMessage
          ].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      }
    );

    const data = await response.json();

    await new Promise(resolve => setTimeout(resolve, typingDelay));

    const aiMessage = {
      id: uuidv4(),
      content: data?.choices?.[0]?.message?.content || "No response from AI",
      role: 'assistant',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);

  } catch (error) {
    console.error("Error:", error);
    toast.error("Groq AI error. Check API key or internet.");
  } finally {
    setIsLoading(false);
  }
};
