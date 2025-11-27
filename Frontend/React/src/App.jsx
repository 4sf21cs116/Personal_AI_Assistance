import { useState, useRef, useEffect } from "react";
import ModeSelector from "./Components/ModeSelector";
import TaskTemplates from "./Components/TaskTemplates";
import ResponseOptions from "./Components/ResponseOptions";
import ChatWindow from "./Components/ChatWindows";
import "./styles.css";

function App() {
  const [mode, setMode] = useState("general");
  const [task, setTask] = useState(null);
  const [style, setStyle] = useState("short");
  const [messages, setMessages] = useState([]);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const chatRef = useRef(null);

  const handleSend = async (prompt) => {
    if (!prompt.trim() || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setIsLoading(true);

    try {
      const start = performance.now();
      const res = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, task, style, prompt }),
      });
      const data = await res.json();
      const latency = (performance.now() - start) / 1000;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response, latency },
      ]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection failed" }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chatRef.current?.scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="app-container">
      <header>
        <h1>Personal AI Assistant</h1>
        <div className="settings-toggle" onClick={() => setControlsVisible(!controlsVisible)}>
          <span>⋮</span>
        </div>

        {controlsVisible && (
          <div className="controls-popup">
            <ModeSelector mode={mode} setMode={setMode} />
            <TaskTemplates task={task} setTask={setTask} />
            <ResponseOptions style={style} setStyle={setStyle} />
          </div>
        )}
      </header>

      <ChatWindow
        ref={chatRef}
        messages={messages}
        onSend={handleSend}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
