'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

export default function LuxuryGalleryModal({
  isOpen,
  onClose,
  item,
  kicker = "OUR EVENTS",
}) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const thumbnailsTrackRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract gallery images list safely
  const getImagesList = useCallback(() => {
    if (!item) return [];
    if (item.images && Array.isArray(item.images) && item.images.length > 0) {
      return item.images;
    }
    const singleUrl = item.media_url || item.image_url;
    if (singleUrl) {
      return [
        {
          id: `single-${item.id || item.identifier || 0}`,
          image_url: singleUrl,
          alt_text: item.title || "Photo",
          caption: item.title || "",
        },
      ];
    }
    return [];
  }, [item]);

  const imagesList = getImagesList();
  const currentImage = imagesList[activeImgIndex] || imagesList[0];

  const handlePrev = useCallback(() => {
    if (imagesList.length <= 1) return;
    setActiveImgIndex((prev) => (prev - 1 + imagesList.length) % imagesList.length);
  }, [imagesList.length]);

  const handleNext = useCallback(() => {
    if (imagesList.length <= 1) return;
    setActiveImgIndex((prev) => (prev + 1) % imagesList.length);
  }, [imagesList.length]);

  const handleScrollThumbnails = (offset) => {
    if (thumbnailsTrackRef.current) {
      thumbnailsTrackRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
        } else if (onClose) {
          onClose();
        }
      }
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isZoomed, onClose, handlePrev, handleNext]);

  // Center active thumbnail in track
  useEffect(() => {
    if (thumbnailsTrackRef.current && thumbnailsTrackRef.current.children[activeImgIndex]) {
      const el = thumbnailsTrackRef.current.children[activeImgIndex];
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeImgIndex]);

  // Reset state when opening new item
  useEffect(() => {
    if (isOpen) {
      setActiveImgIndex(0);
      setIsZoomed(false);
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  return (
    <>
      {/* Luxury Modal Backdrop */}
      <div
        className="luxury-gallery-modal-backdrop"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={item.title || "Gallery"}
      >
        <div
          className="luxury-gallery-modal-card"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Close Button */}
          <button
            type="button"
            className="gallery-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Two-Column Layout */}
          <div className="gallery-modal-grid">

            {/* Left Column: Title & Story Only */}
            <div className="gallery-modal-info-col">
              <span className="gallery-modal-kicker">{kicker}</span>
              <h2 className="gallery-modal-title">{item.title}</h2>
              <div className="gallery-modal-divider" />

              <div className="gallery-modal-story-wrap">
                <p className="gallery-modal-story">
                  {item.story || item.desc || "From intimate ceremonies to grand celebrations, we create unforgettable experiences tailored to your vision."}
                </p>
              </div>
            </div>

            {/* Right Column: Featured Image & Carousel */}
            <div className="gallery-modal-media-col">
              <div className="gallery-modal-featured-wrapper">
                {currentImage?.image_url && (
                  item.media_type === 'video' && activeImgIndex === 0 ? (
                    <video
                      src={currentImage.image_url}
                      controls
                      autoPlay
                      className="gallery-modal-featured-img"
                    />
                  ) : (
                    <Image
                      src={currentImage.image_url}
                      alt={currentImage.alt_text || item.title || "Gallery Photo"}
                      fill
                      sizes="(max-width: 860px) 100vw, 750px"
                      className="gallery-modal-featured-img"
                      priority
                    />
                  )
                )}

                {/* Individual Zoom Button on each picture */}
                <button
                  type="button"
                  className="gallery-zoom-btn"
                  onClick={() => setIsZoomed(true)}
                  aria-label="Zoom and inspect photo"
                  title="Zoom picture"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </button>

                {/* Prev Navigation Button */}
                {imagesList.length > 1 && (
                  <button
                    type="button"
                    className="gallery-nav-btn gallery-nav-prev"
                    onClick={handlePrev}
                    aria-label="Previous image"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                )}

                {/* Next Navigation Button */}
                {imagesList.length > 1 && (
                  <button
                    type="button"
                    className="gallery-nav-btn gallery-nav-next"
                    onClick={handleNext}
                    aria-label="Next image"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                )}

                {/* Image Counter Badge */}
                <div className="gallery-image-counter">
                  {activeImgIndex + 1} / {imagesList.length}
                </div>
              </div>

              {/* Thumbnails Row */}
              {imagesList.length > 1 && (
                <div className="gallery-thumbnails-wrapper">
                  <div className="gallery-thumbnails-track" ref={thumbnailsTrackRef}>
                    {imagesList.map((img, idx) => (
                      <button
                        key={img.id || idx}
                        type="button"
                        className={`gallery-thumbnail-item ${idx === activeImgIndex ? 'active' : ''}`}
                        onClick={() => setActiveImgIndex(idx)}
                        aria-label={`View photo ${idx + 1}`}
                      >
                        <Image
                          src={img.image_url}
                          alt={img.alt_text || `Thumbnail ${idx + 1}`}
                          fill
                          loading="lazy"
                          quality={75}
                          sizes="120px"
                          className="gallery-thumbnail-img"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Scroll right button */}
                  <button
                    type="button"
                    className="gallery-thumbs-scroll-btn"
                    onClick={() => handleScrollThumbnails(180)}
                    aria-label="Scroll thumbnails"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* High-Resolution Zoom Lightbox Overlay rendered into document.body to ensure top-layer stacking */}
      {isZoomed && currentImage?.image_url && mounted && createPortal(
        <div
          className="image-zoom-overlay"
          onClick={() => setIsZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Zoomed Photo View"
        >
          {/* Close button */}
          <button
            type="button"
            className="image-zoom-close-btn"
            onClick={() => setIsZoomed(false)}
            aria-label="Close zoom view"
            title="Close zoom (Esc)"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Prev Photo in Zoom View */}
          {imagesList.length > 1 && (
            <button
              type="button"
              className="image-zoom-nav-btn image-zoom-nav-prev"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous photo"
              title="Previous photo"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          )}

          {/* Next Photo in Zoom View */}
          {imagesList.length > 1 && (
            <button
              type="button"
              className="image-zoom-nav-btn image-zoom-nav-next"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next photo"
              title="Next photo"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          )}

          <div
            className="image-zoom-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="image-zoom-media-wrapper">
              <Image
                src={currentImage.image_url}
                alt={currentImage.alt_text || item.title || "Zoomed Photo"}
                fill
                sizes="95vw"
                className="image-zoom-img"
                priority
              />
            </div>
            <div className="image-zoom-caption-bar">
              <span className="image-zoom-title">{item.title}</span>
              <span className="image-zoom-meta">Photo {activeImgIndex + 1} of {imagesList.length}</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
