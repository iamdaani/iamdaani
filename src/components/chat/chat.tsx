// ✅ Minimal bulletproof working chat.tsx using Groq tools

'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect } from 'react';
import { getContact } from '@/app/api/chat/tools/getContact';

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
    setInput,
    addToolResult,
  } = useChat({
    onToolCall: async (toolCall) => {
      const { toolCallId, toolName, args } = toolCall.toolCall;

      const toolMap = {
        getContact,
      };

      const toolFn = toolMap[toolName as keyof typeof toolMap];
      if (!toolFn) {
        console.error('Tool not found:', toolName);
        return;
      }

      const coreMessages = messages.filter(
        (msg) => msg.role === 'system' || msg.role === 'user' || msg.role === 'assistant'
      ) as Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
      const result = await toolFn.execute(args || {}, { toolCallId, messages: coreMessages });
      addToolResult({ toolCallId, result });
    },
  });

  useEffect(() => {
    append({ role: 'user', content: 'Can you give me contact info?' });
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
          placeholder="Ask me something..."
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>

      <div>
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.role}</strong>: {msg.content || '[Tool call]'}
          </div>
        ))}
      </div>
    </div>
  );
}
