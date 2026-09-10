'use client';

import React, { useState, useRef } from 'react';

export default function VideoCard({ video, index }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayClick = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn("Video playback not allowed or interrupted:", err);
      });
    }
  };

  // Determine category badge based on title or index
  const isWedding = video.title?.toLowerCase().includes('wedding') || index === 0;
  const categoryLabel = isWedding ? '✨ Wedding Experience' : '🏆 Signature Celebration';

  return (
    <div className="video-card">
      <div className="video-viewport">
        <video
          ref={videoRef}
          src={video.video_url}
          className="video-player"
          playsInline
          preload="metadata"
          controls={isPlaying}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Top Clean Badges - No 'LIVE' */}
        <div className="video-top-bar">
          <span className="video-story-badge">
            EVENT FILM
          </span>
          <span className="video-brand-tag">RAJ HANSH STORIES</span>
        </div>

        {/* Cinematic Golden Play Overlay */}
        {!isPlaying && (
          <div className="video-play-overlay" onClick={handlePlayClick}>
            <div className="video-play-button" role="button" aria-label={`Play ${video.title}`}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="video-play-text">WATCH STORY</span>
          </div>
        )}
      </div>

      <div className="video-caption">
        <div className="video-caption-meta">
          <span className="video-category-tag">{categoryLabel}</span>
          <span className="video-stars-rating">★ 5.0 • Client Story</span>
        </div>
        <h3 className="video-title">{video.title}</h3>
        <p className="video-desc">
          Heartfelt client moments and unforgettable celebration memories captured across Jharkhand.
        </p>
      </div>
    </div>
  );
}
