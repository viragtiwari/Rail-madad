import React, { useState, useRef } from "react";
import { PaperClipIcon } from "@heroicons/react/outline";
import { ArrowRightIcon } from "@heroicons/react/solid";
import { TypeAnimation } from "react-type-animation";
import cross from "../src/assets/Images/delete.png";

const App = () => {
  const [currentChat, setCurrentChat] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
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

    const imageFiles = newFiles.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length > 0) {
      const newPreviewImages = imageFiles.map((file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
        });
      });

      Promise.all(newPreviewImages).then((images) => {
        setPreviewImages((prevImages) => [...prevImages, ...images]);
      });
    }

   
    if (photoInputRef.current) photoInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (audioInputRef.current) audioInputRef.current.value = "";
  };

  const handleSend = async () => {
    if (inputText || selectedFiles.length > 0) {
      const newEntry = {
        type: "sent",
        text: inputText,
        files: selectedFiles,
      };

      setCurrentChat((prevChat) => [...prevChat, newEntry]);

    
      setInputText("");
      setSelectedFiles([]);
      setPreviewImages([]); 

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
              className={`mb-4 max-w-lg p-3 rounded-2xl ${
                entry.type === "sent"
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
        <div className="relative flex items-center w-full">
          <div className="relative flex items-center w-full">
            {previewImages.length > 0 && (
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex space-x-2">
                {previewImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-2xl"
                    />
                    <button
                      onClick={() => {
                        setPreviewImages((prevImages) =>
                          prevImages.filter((_, i) => i !== index)
                        );
                        setSelectedFiles((prevFiles) =>
                          prevFiles.filter((file, i) => i !== index)
                        );
                      }}
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                    >
                      <img src={cross} alt="cross" className="w-2 h-2" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <textarea
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter your message"
              className={`flex-grow h-16 p-5 rounded-3xl bg-neutral-700 text-white placeholder-white resize-none focus:outline-none ${
                previewImages.length > 0 ? "pl-24" : ""
              }`}
              style={{ paddingLeft: previewImages.length > 0 ? `${previewImages.length * 48 + 50}px` : '16px' }}
            />
          </div>

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
