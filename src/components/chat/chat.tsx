'use client';

import { useChat } from '@ai-sdk/react';
import React from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, addToolResult, isLoading } = useChat({
    // Remove onToolCall handler since 'result' does not exist on ToolCall.
    // Tool results should be handled via the SDK's built-in mechanisms or correct event.
  });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask: 'What are your skills?'"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>

      <div style={{ marginTop: 20 }}>
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
      </div>
    </div>
  )
}
