import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleFileUpload = (e) => {
    setSelectedFiles(e.target.files);
  };

  const handleSend = () => {
    if (inputText || selectedFiles) {
      const newEntry = {
        type: "sent",
        text: inputText,
        files: selectedFiles,
      };

      setCurrentChat((prevChat) => [
        ...prevChat,
        newEntry,
        {
          type: "received",
          text: "This is a dummy response ",
        },
      ]);

      setInputText("");
      setSelectedFiles(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    if (currentChat.length > 0) {
      setChatSessions((prevSessions) => [
        ...prevSessions,
        { id: chatSessions.length + 1, messages: currentChat },
      ]);
    }
    setCurrentChat([]);
  };

  const handleEndChat = () => {
    alert("Chat has ended.");
  };

  const loadChatHistory = (id) => {
    const selectedSession = chatSessions.find((session) => session.id === id);
    if (selectedSession) {
      setCurrentChat(selectedSession.messages);
    }
  };

  return (
    <div className="app-container">
      <div className="chat-history">
        <h2>Chat History</h2>
        {chatSessions.map((session) => (
          <div
            key={session.id}
            className="chat-session"
            onClick={() => loadChatHistory(session.id)} >
            {session.messages[0].text || "Untitled Chat"}
          </div>
        ))}
      </div>

      <div className="chat-display">
        {currentChat.map((entry, index) => (
          <div
            key={index}
            className={`chat-entry ${
              entry.type === "sent" ? "sent" : "received"
            }`}
          >
            {entry.text && <p>{entry.text}</p>}
            {entry.files &&
              Array.from(entry.files).map((file, index) => (
                <div key={index} className="file-preview">
                  {file.type.startsWith("image/") && (
                    <img src={URL.createObjectURL(file)}/>
                  )}
                  {file.type.startsWith("video/") && (
                    <video controls>
                      <source
                        src={URL.createObjectURL(file)}
                        type={file.type}
                      />
                    </video>
                  )}
                  {file.type.startsWith("image/") && (
                    <audio controls>
                      <source
                        src={URL.createObjectURL(file)}
                        type={file.type}
                      />
                    </audio>
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="chat-input-section">
        <textarea
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}  
          placeholder="Enter your message"
        />
        <input
          type="file"
          accept="image/,video/,audio/*"
          onChange={handleFileUpload}
          multiple
        />
        <button onClick={handleSend}>Send</button>

        <div className="chat-controls">
          <button onClick={handleNewChat}>New Chat</button>
          <button onClick={handleEndChat}>End Chat</button>
        </div>
      </div>
    </div>
  );
};

export default App;