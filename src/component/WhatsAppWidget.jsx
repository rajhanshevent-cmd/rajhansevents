"use client";

import React, { useState, useSyncExternalStore } from "react";
import { BUSINESS_CONFIG } from "@/utils/constants";
import WhatsAppIcon from "@/component/WhatsAppIcon";
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
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ transform: 'translateX(1px)', display: 'block' }}>
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
          <WhatsAppIcon size={30} color="#ffffff" />
        )}
      </button>
    </div>
  );
}