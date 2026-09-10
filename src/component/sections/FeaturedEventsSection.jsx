'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import LuxuryGalleryModal from '@/component/LuxuryGalleryModal';
import '@/app/portfolio/Portfolio.css';

export default function FeaturedEventsSection({ initialData = [] }) {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fallbackFeatured = [
    {
      identifier: 'feat-1',
      title: 'Royal Wedding',
      location: 'Ranchi, Jharkhand',
      image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200',
      story: 'A regal palace celebration orchestrated with majestic floral mandaps, ambient candlelit pathways, and grand procession choreography.',
    },
    {
      identifier: 'feat-2',
      title: 'Grand Reception',
      location: 'Ranchi, Jharkhand',
      image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200',
      story: 'An opulent evening reception featuring custom stage architectural styling, crystal chandeliers, and curated multi-cuisine culinary service.',
    },
    {
      identifier: 'feat-3',
      title: 'Birthday Gala',
      location: 'Ranchi, Jharkhand',
      image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200',
      story: 'Vibrant milestone birthday celebration decorated with enchanted floral arches, personalized stage design, and joyful party atmospheres.',
    },
  ];

  const displayFeatured = initialData && initialData.length > 0 ? initialData : fallbackFeatured;

  return (
    <div className="home-featured-section">
      <div className="container">
        <div className="elegant-section-header">
          <span className="section-kicker">— FEATURED EVENTS</span>
          <h2 className="elegant-section-title">A glimpse into the magic we create.</h2>
        </div>

        <div className="grid-3 featured-cards-grid">
          {displayFeatured.map((event, index) => (
            <div
              key={event.identifier || event.id || index}
              className="featured-card"
              onClick={() => setSelectedEvent(event)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedEvent(event)}
              aria-label={`View and zoom ${event.title || 'Featured Event'}`}
            >
              {/* Card Image Wrapper */}
              <div className="featured-image-wrapper">
                <Image
                  src={event.image_url || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800'}
                  alt={event.title || 'Featured Event'}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* Floating Zoom Indicator Badge */}
                <div className="featured-zoom-badge" title="Click to zoom image">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="11" y1="8" x2="11" y2="14"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </div>
              </div>

              {/* Title and Details Placed Cleanly Beneath the Image */}
              <div className="featured-card-info">
                <span className="featured-card-kicker">
                  {event.location || 'Ranchi, Jharkhand'}
                </span>
                <h3 className="featured-card-title">{event.title}</h3>
                <span className="featured-card-action">
                  Zoom &amp; Explore &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High-Resolution Luxury Modal with Individual Image Zoom & Story */}
      <LuxuryGalleryModal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        item={selectedEvent}
        kicker="FEATURED EVENTS"
      />
    </div>
  );
}
