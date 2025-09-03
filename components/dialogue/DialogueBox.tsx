"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface DialogueMessage {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function DialogueBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<DialogueMessage[]>([
    {
      id: 1,
      text: "Welcome! This connects you to our WhatsApp group for instant booking help. How can I assist you?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");

  const quickResponses = [
    "Check availability",
    "View room rates",
    "Book now",
    "Contact us",
    "Gallery"
  ];

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: DialogueMessage = {
      id: messages.length + 1,
      text: text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");

    // Handle WhatsApp redirects for quick responses
    const whatsappGroupUrl = "https://chat.whatsapp.com/KoLakeVillaEnquire";
    
    if (quickResponses.includes(text)) {
      let message = "";
      switch(text) {
        case "Check availability":
          message = "Hi! I'd like to check availability for Ko Lake Villa. When can I book?";
          break;
        case "View room rates":
          message = "Hello! Can you share the current room rates for Ko Lake Villa?";
          break;
        case "Book now":
          message = "Hi! I'm ready to book Ko Lake Villa. Please help me with the booking process.";
          break;
        case "Contact us":
          message = "Hello! I'd like to contact Ko Lake Villa team.";
          break;
        case "Gallery":
          message = "Hi! I'd like to see more photos of Ko Lake Villa.";
          break;
      }
      
      // Open WhatsApp group
      window.open(whatsappGroupUrl, '_blank');
      
      // Add bot response
      const botMessage: DialogueMessage = {
        id: messages.length + 2,
        text: "Opening WhatsApp to connect you with our team! We'll respond quickly there.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Close dialogue after a moment
      setTimeout(() => setIsOpen(false), 2000);
      return;
    }

    // Simulate response for custom messages
    setTimeout(() => {
      const botMessage: DialogueMessage = {
        id: messages.length + 2,
        text: "Thanks for your message! Please join our WhatsApp group for the fastest response from our team.",
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 bg-amber-600 hover:bg-amber-700 text-white rounded-full p-2 shadow-lg transition-all duration-300 ${isOpen ? 'hidden' : 'block'}`}
        title="Chat via WhatsApp"
      >
        <div className="w-4 h-4 flex items-center justify-center text-sm">
          💬
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-amber-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="font-medium">WhatsApp Connection</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.isUser
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Responses */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex flex-wrap gap-1 mb-3">
              {quickResponses.map((response) => (
                <button
                  key={response}
                  onClick={() => handleSendMessage(response)}
                  className="text-xs bg-gray-100 hover:bg-amber-100 text-gray-700 px-2 py-1 rounded-full transition-colors"
                >
                  {response}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                onClick={() => handleSendMessage(inputText)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}