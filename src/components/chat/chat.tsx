'use client';

import { useChat } from '@ai-sdk/react';
import React from 'react';

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    addToolResult,
  } = useChat({
    api: '/api/chat',
    onToolCall: ({ toolCall, ...rest }) => {
      // When the backend streams back a tool result, this handler fires:
      const result = (rest as any).result;
      if (result !== undefined) {
        addToolResult({
          toolCallId: toolCall.toolCallId,
          result: result,
        });
      }
    },
  });

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask: what are your skills?"
          style={{ flex: 1, padding: 8 }}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading} style={{ padding: '0 16px' }}>
          Send
        </button>
      </form>

      <div style={{ marginTop: 20 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <strong>{m.role}:</strong>{' '}
            {m.parts?.some(p => p.type === 'tool-invocation') 
              ? '[Tool call]' 
              : m.content}
          </div>
        ))}
      </div>
    </div>
  );
}
