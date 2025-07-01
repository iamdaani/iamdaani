'use client'; // MUST BE FIRST LINE - NO EXCEPTIONS

import { useState, useRef } from 'react';

type Message = { role: string; content: string };

const ChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const processChunk = (text: string) => {
    // Check for function call tags
    const functionStart = text.indexOf('<function>');
    const functionEnd = text.indexOf('</function>');
    
    if (functionStart !== -1 && functionEnd !== -1) {
      // Extract function JSON
      const jsonString = text.slice(functionStart + 10, functionEnd);
      
      try {
        const toolCalls = JSON.parse(jsonString);
        console.log('Function call detected:', toolCalls);
        // Handle function execution here
      } catch (e) {
        console.error('Error parsing function call:', e);
      }
      
      // Remove function tags from visible content
      return text.replace(/<function>.*?<\/function>/, '');
    }
    
    return text;
  };

  async function sendMessage() {
    if (!input.trim() || isLoading) return;
    
    setIsLoading(true);
    abortControllerRef.current = new AbortController();
    
    try {
      const userMessage: Message = { role: 'user', content: input };
      const newMessages = [...messages, userMessage];
      setMessages([...newMessages, { role: 'assistant', content: '' }]);
      setInput('');
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages: newMessages,
          stream: true
        }),
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal
      });

      if (!response.body) throw new Error('No response body');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const textChunk = decoder.decode(value, { stream: true });
        fullResponse += textChunk;
        
        // Process for function calls and get visible text
        const visibleText = processChunk(fullResponse);
        
        // Update last assistant message
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last.role === 'assistant') {
            return [
              ...prev.slice(0, -1),
              { ...last, content: visibleText }
            ];
          }
          return prev;
        });
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
      } else {
        console.error('Error:', error);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Sorry, something went wrong. Please try again.' 
        }]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }

  function stopGeneration() {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
    }
  }

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      
      <div className="input-area">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          disabled={isLoading}
          placeholder="Type your message..."
        />
        
        {isLoading ? (
          <button onClick={stopGeneration}>Stop</button>
        ) : (
          <button onClick={sendMessage} disabled={!input.trim()}>Send</button>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;