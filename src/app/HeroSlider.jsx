'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CalendlyButton from '@/component/CalendlyButton';

export default function HeroSlider({ homeData }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Helper to determine if media URL is a video format
  const isVideoMedia = (url) => {
    if (!url) return true;
    const cleanUrl = url.split('?')[0].toLowerCase();
    return (
      cleanUrl.endsWith('.mp4') ||
      cleanUrl.endsWith('.webm') ||
      cleanUrl.endsWith('.mov') ||
      cleanUrl.endsWith('.ogg') ||
      cleanUrl.endsWith('.m4v')
    );
  };

  const [mediaError, setMediaError] = useState(false);

  // Dynamically detect media type (image or video) from custom Cloudflare asset
  const bannerMedia = homeData?.banner_video_url;
  const isCustomVideo = bannerMedia ? isVideoMedia(bannerMedia) : true;
  const firstSlideSrc = (!mediaError && bannerMedia) ? bannerMedia : '/hero.mp4';
  const firstSlideType = (!mediaError && bannerMedia) ? (isCustomVideo ? 'video' : 'image') : 'video';

  // Define slides with curated fallback media
  const slides = [
    { type: firstSlideType, src: firstSlideSrc },
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
              key={slide.src}
              autoPlay
              loop
              muted
              playsInline
              crossOrigin="anonymous"
              className="hero-media"
              poster={homeData?.thumbnail_url || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1600'}
              preload="metadata"
              onError={() => {
                if (index === 0 && !mediaError) setMediaError(true);
              }}
            >
              <source src={slide.src} />
            </video>
          ) : (
            <Image
              key={slide.src}
              src={slide.src}
              alt={`Celebration showcase slide ${index + 1}`}
              fill
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              sizes="100vw"
              className="hero-media"
              style={{ objectFit: 'cover' }}
              onError={() => {
                if (index === 0 && !mediaError) setMediaError(true);
              }}
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

        <span className="hero-kicker-pill">LUXURY CELEBRATIONS</span>
        <h1>{homeData?.banner_title?.trim() || "Raj Hansh Events"}</h1>
        <p>{homeData?.banner_text?.trim() || "Creating royal experience."}</p>

        <div className="hero-cta-group">
          <CalendlyButton />
          <Link href="/services" className="hero-secondary-btn">
            Explore Services
          </Link>
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
      <button
        type="button"
        onClick={() => {
          document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="scroll-down-hint"
        aria-label="Scroll down to services"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <span className="scroll-mouse">
          <span className="scroll-wheel" />
        </span>
      </button>
    </section>
  );
}