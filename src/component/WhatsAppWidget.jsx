"use client";

import React, { useState, useSyncExternalStore } from "react";
import { BUSINESS_CONFIG } from "@/utils/constants";
import "./WhatsAppWidget.css";

const subscribe = () => () => {};
const getSnapshot = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const getServerSnapshot = () => "10:00 AM";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const currentTime = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const botNumber = BUSINESS_CONFIG.whatsappNumber;

  // Handles both the input field and quick reply clicks
  const handleSend = (textToSend = message) => {
    if (!textToSend.trim()) return;
    
    // Encode the message and open WhatsApp
    const url = `https://wa.me/${botNumber}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, "_blank");
    
    // Clear message after sending
    setMessage("");
  };

  // Pre-defined luxury enquiry options
  const quickReplies = [
    "I'm looking for Wedding Planning 💍",
    "I need help with a Corporate Event 🏢",
    "Can I get a custom quote? 📋"
  ];

  return (
    <div className="wa-widget-container" aria-label="Chat with us on WhatsApp">
      {/* The Chat Window */}
      {isOpen && (
        <div className="wa-chat-window" role="dialog" aria-modal="true">
          {/* Branded Header */}
          <div className="wa-chat-header">
            <div className="wa-chat-avatar-info">
              <div className="wa-avatar">
                <span>RH</span>
                <span className="wa-online-dot" />
              </div>
              <div className="wa-chat-title">
                <strong>Raj Hansh Events</strong>
                <p>
                  <span className="wa-status-text">Online</span> &bull; Typically replies in 5 mins
                </p>
              </div>
            </div>
            <button 
              type="button"
              className="wa-close-btn" 
              onClick={() => setIsOpen(false)}
              aria-label="Close WhatsApp chat"
            >
              &times;
            </button>
          </div>

          {/* Chat Body with Quick Replies */}
          <div className="wa-chat-body">
            <div className="wa-bot-message-wrapper">
              <div className="wa-bot-message">
                Hi there! &#128075; Welcome to Raj Hansh Events. How can our wedding & event curators assist your celebration?
              </div>
              {currentTime && <span className="wa-message-time">{currentTime}</span>}
            </div>
            
            <div className="wa-quick-replies">
              <span className="wa-quick-prompt">Quick Enquiries:</span>
              {quickReplies.map((reply, index) => (
                <button 
                  key={index} 
                  type="button"
                  className="wa-quick-reply-btn"
                  onClick={() => handleSend(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="wa-chat-footer">
            <input
              type="text"
              placeholder="Ask us anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(message)}
              aria-label="Your message"
            />
            <button 
              type="button"
              className="wa-send-btn" 
              onClick={() => handleSend(message)}
              aria-label="Send message on WhatsApp"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button 
        type="button"
        className={`wa-floating-btn ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close WhatsApp widget" : "Open WhatsApp chat widget"}
      >
        <span className="wa-pulse-ring" />
        {isOpen ? (
          <span className="wa-btn-close-icon">&times;</span>
        ) : (
          <svg viewBox="0 0 32 32" width="30" height="30" fill="currentColor">
            <path d="M16.05 1.76c-7.9 0-14.3 6.42-14.3 14.33 0 2.52.65 4.98 1.9 7.15L1.7 30.22l7.14-1.87c2.1 1.18 4.47 1.8 6.9 1.8h.01c7.9 0 14.3-6.42 14.3-14.33S23.95 1.76 16.05 1.76zm0 24.16h-.01c-2.14 0-4.23-.57-6.07-1.66l-.43-.26-4.52 1.18 1.2-4.4-.28-.45a11.8 11.8 0 01-1.8-6.42c0-6.52 5.3-11.82 11.83-11.82s11.8 5.3 11.8 11.82-5.3 11.83-11.82 11.83zm6.48-8.83c-.35-.18-2.1-.1-2.42.06-.32.17-.56.28-.7.5-.13.2-.5 1.2-.6 1.44-.12.24-.26.27-.6.1-1.65-.85-2.85-1.52-4.1-3.65-.13-.22 0-.32.16-.48.15-.15.35-.4.5-.6.18-.24.24-.4.36-.67.12-.26.06-.5-.03-.67-.1-.17-.7-1.7-.96-2.33-.25-.6-.5-.52-.7-.52h-.57c-.24 0-.64.08-.98.44-.34.37-1.3 1.27-1.3 3.1 0 1.83 1.35 3.6 1.54 3.84.18.25 2.62 4.02 6.35 5.63.88.38 1.58.6 2.13.78.9.3 1.7.25 2.34.15.72-.1 2.1-.86 2.4-1.7.3-.83.3-1.54.2-1.7-.1-.15-.35-.25-.7-.42z" />
          </svg>
        )}
      </button>
    </div>
  );
}