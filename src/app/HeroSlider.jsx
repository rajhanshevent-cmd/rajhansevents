'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import CalendlyButton from '@/component/CalendlyButton';

export default function HeroSlider({ homeData }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Define slides with curated fallback media
  const slides = [
    { type: 'video', src: homeData?.banner_video_url || '/hero.mp4' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1600' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1600' }
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  // Automatic slide effect with pause-on-hover
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <section 
      className="hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Raj Hansh Events Hero Showcase"
    >
      <div className="hero-overlay" />
      
      {/* Slides Loop for Fade & Zoom */}
      {slides.map((slide, index) => (
        <div key={index} className={`hero-slide ${index === currentSlide ? 'active' : ''}`}>
          {slide.type === 'video' ? (
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              crossOrigin="anonymous" 
              className="hero-media"
            >
              <source src={slide.src} type="video/mp4" />
            </video>
          ) : (
            <img 
              src={slide.src} 
              alt={`Celebration showcase slide ${index + 1}`} 
              className="hero-media" 
            />
          )}
        </div>
      ))}

      {/* Prev / Next Controls */}
      <button 
        type="button"
        className="hero-nav-arrow hero-prev" 
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        &#10094;
      </button>
      <button 
        type="button"
        className="hero-nav-arrow hero-next" 
        onClick={nextSlide}
        aria-label="Next slide"
      >
        &#10095;
      </button>
      
      {/* Hero Content Block */}
      <div className="hero-content">
        <div className="logo-wrapper">
          <Image 
            src="/vblogo.png" 
            alt="Raj Hansh Monogram" 
            width={130} 
            height={130}
            priority
            className="hero-brand-logo"
          />
        </div>
        
        <span className="hero-kicker-pill">LUXURY CELEBRATIONS &middot; RANCHI</span>
        <h1>{homeData?.banner_title || "Raj Hansh Events"}</h1>
        <p>{homeData?.banner_text || "Turning your most precious milestones into unforgettable royal memories since 2016."}</p>
        
        <div className="hero-cta-group">
          <CalendlyButton />
          <a href="#services" className="hero-secondary-btn">
            Explore Services
          </a>
        </div>

        {/* Thin-Line Slider Controls */}
        <div className="hero-controls" role="tablist" aria-label="Slide Selector">
          {slides.map((_, index) => (
            <button 
              key={index} 
              type="button"
              role="tab"
              aria-selected={index === currentSlide}
              aria-label={`Slide ${index + 1}`}
              className={`slide-line ${index === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Subtle Scroll Down Indicator */}
      <a href="#services" className="scroll-down-hint" aria-label="Scroll down to services">
        <span className="scroll-mouse">
          <span className="scroll-wheel" />
        </span>
      </a>
    </section>
  );
}