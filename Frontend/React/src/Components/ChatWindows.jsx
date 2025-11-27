import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const ChatWindow = forwardRef(({ messages, onSend, isLoading }, ref) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const cleanMarkdown = (text) =>
    text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1");

  const parseMessage = (content) => {
    const parts = [];
    let lastIndex = 0;
    const codeRegex = /```([a-z]*)\n([\s\S]*?)```/g;
    let match;
    while ((match = codeRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const text = cleanMarkdown(content.slice(lastIndex, match.index).trim());
        if (text) parts.push({ type: "text", content: text });
      }
      parts.push({ type: "code", language: match[1] || "text", content: match[2] });
      lastIndex = codeRegex.lastIndex;
    }
    const remaining = cleanMarkdown(content.slice(lastIndex).trim());
    if (remaining) parts.push({ type: "text", content: remaining });
    return parts;
  };

  useImperativeHandle(ref, () => ({
    scrollToBottom: () => {
      const el = document.getElementById("chat-messages");
      if (el) el.scrollTop = el.scrollHeight;
    },
  }));

  return (
    <div id="chat-messages" className="chat-window">
      {messages.map((msg, idx) => (
        <div key={idx} className={`message ${msg.role}`}>
          {msg.role === "assistant" ? (
            parseMessage(msg.content).map((part, i) =>
              part.type === "code" ? (
                <SyntaxHighlighter
                  key={i}
                  language={part.language}
                  style={materialDark}
                  showLineNumbers={false}
                  wrapLongLines={true}
                  lineProps={() => ({ style: { display: "block", background: "transparent" } })}
                  customStyle={{
                    background: "#0a0a0a",
                    border: "1px solid #333",
                    borderRadius: "16px",
                    padding: "16px",
                    margin: "12px 0",
                    fontSize: "13.5px",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.5)",
                    lineHeight: "1.6",
                  }}
                >
                  {part.content.trim()}
                </SyntaxHighlighter>
              ) : (
                <div key={i} className="assistant-text">
                  {part.content}
                </div>
              )
            )
          ) : (
            <div>{msg.content}</div>
          )}
          {msg.latency && <div className="latency">Latency: {msg.latency.toFixed(2)}s</div>}
        </div>
      ))}

      {isLoading && (
        <div className="message assistant">
          <div className="loading-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      )}

      <div className="input-area">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading}>Send</button>
      </div>
    </div>
  );
});

export default ChatWindow;
