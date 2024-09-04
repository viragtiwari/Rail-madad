import React, { useState, useRef } from "react";
import { PaperClipIcon } from "@heroicons/react/outline";
import { ArrowRightIcon } from "@heroicons/react/solid";
import { TypeAnimation } from "react-type-animation";

const App = () => {
  const [currentChat, setCurrentChat] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const audioInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const photoInputRef = useRef(null);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleFileUpload = (files) => {
    const newFiles = Array.from(files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);

    const imageFile = newFiles.find(file => file.type.startsWith("image/"));
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const handleSend = async () => {
    if (inputText || selectedFiles.length > 0) {
      const newEntry = {
        type: "sent",
        text: inputText,
        files: selectedFiles,
      };
      
      setCurrentChat((prevChat) => [...prevChat, newEntry]);

      try {
        const formData = new FormData();
        formData.append("message", inputText);

        if (selectedFiles.length > 0) {
          selectedFiles.forEach((file) => formData.append("files", file));
        }
        
        const response = await fetch("http://127.0.0.1:5000/api/chat", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        setCurrentChat((prevChat) => [
          ...prevChat,
          {
            type: "received",
            text: data.response,
          },
        ]);

      } catch (error) {
        console.error("Error sending message:", error);
      }

      setInputText("");
      setSelectedFiles([]);
      setPreviewImage(null); // Clear the preview image
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleOptionClick = (type) => {
    setIsMenuOpen(false);
    switch (type) {
      case "photo":
        if (photoInputRef.current) {
          photoInputRef.current.click();
        }
        break;
      case "video":
        if (videoInputRef.current) {
          videoInputRef.current.click();
        }
        break;
      case "audio":
        if (audioInputRef.current) {
          audioInputRef.current.click();
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col overflow-x-hidden h-screen font-sans bg-zinc-900 text-white relative">
      <div className="flex-grow p-5 bg-zinc-900 overflow-y-auto">
        {currentChat.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <TypeAnimation
              sequence={["Hello 👋, How can I help you today?", 2000]}
              wrapper="p"
              cursor={true}
              className="text-2xl text-white"
            />
          </div>
        )}
        <div className="flex flex-col">
          {currentChat.map((entry, index) => (
            <div
              key={index}
              className={`mb-4 max-w-lg p-3 rounded-2xl ${entry.type === "sent"
                ? "self-end bg-orange-500 text-right ml-auto"
                : "self-start bg-white border border-gray-700 text-left mr-auto text-black"
                }`}
            >
              {entry.text && <p className="break-words">{entry.text}</p>}
              {entry.files &&
                entry.files.map((file, index) => (
                  <div key={index} className="mt-2">
                    {file.type.startsWith("image/") && (
                      <img
                        src={URL.createObjectURL(file)}
                        className="max-w-full rounded"
                        alt="uploaded"
                      />
                    )}
                    {file.type.startsWith("video/") && (
                      <video controls className="max-w-full rounded">
                        <source
                          src={URL.createObjectURL(file)}
                          type={file.type}
                        />
                      </video>
                    )}
                    {file.type.startsWith("audio/") && (
                      <audio controls className="w-full">
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
      </div>

      <div className="p-5 bg-zinc-800 bg-opacity-90 flex items-center relative">
        <div className="relative flex items-center">
          <textarea
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Enter your message"
            className={`w-[90vw] h-16 p-5 ml-[50px] rounded-3xl bg-neutral-700 text-white placeholder-white resize-none focus:outline-none ${previewImage ? 'pr-24' : ''}`}
          />
          
          {previewImage && (
            <div className="absolute right-24 top-1/2 transform -translate-y-1/2 bg-gray-700 rounded border border-gray-600">
              <img
                src={previewImage}
                alt="Preview"
                className="w-auto h-16 object-cover rounded"
              />
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
              >
                ✖️
              </button>
            </div>
          )}

          <button
            onClick={toggleMenu}
            className="absolute inset-y-0 right-16 flex items-center pr-3 text-neutral-400 hover:text-white focus:outline-none"
            aria-label="Attach files"
          >
            <PaperClipIcon className="w-6 h-6" />
          </button>

          {isMenuOpen && (
            <div className="absolute bottom-full mb-2 right-16 bg-gray-500 rounded-lg shadow-lg z-10">
              <button
                onClick={() => handleOptionClick("photo")}
                className="flex items-center px-4 py-2 hover:bg-orange-500 w-full text-left"
              >
                📷 Photo
              </button>
              <button
                onClick={() => handleOptionClick("video")}
                className="flex items-center px-4 py-2 hover:bg-orange-500 w-full text-left"
              >
                🎥 Video
              </button>
              <button
                onClick={() => handleOptionClick("audio")}
                className="flex items-center px-4 py-2 hover:bg-orange-500 w-full text-left"
              >
                🎙️ Audio
              </button>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            multiple
            ref={photoInputRef}
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <input
            type="file"
            accept="video/*"
            multiple
            ref={videoInputRef}
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />
          <input
            type="file"
            accept="audio/*"
            multiple
            ref={audioInputRef}
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />

          <button
            onClick={handleSend}
            className="absolute inset-y-0 right-2 flex items-center pr-3 text-neutral-400 hover:text-white"
          >
            <ArrowRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
