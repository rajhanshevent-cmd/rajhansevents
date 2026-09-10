'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import LuxuryGalleryModal from '@/component/LuxuryGalleryModal';
import '@/app/portfolio/Portfolio.css';

export default function ExpertiseSection({ initialData = [] }) {
  const [expertiseItems, setExpertiseItems] = useState(initialData);
  const [selectedExpertise, setSelectedExpertise] = useState(null);
  const [loading, setLoading] = useState(!initialData || initialData.length === 0);

  useEffect(() => {
    let isMounted = true;
    const fetchExpertise = async () => {
      try {
        const res = await fetch('/api/expertise');
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
          setExpertiseItems(json.data);
        }
      } catch (err) {
        console.error('Error fetching expertise data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchExpertise();

    return () => {
      isMounted = false;
    };
  }, []);

  const fallbackExpertise = [
    {
      identifier: 'exp-1',
      title: 'Wedding Planning',
      image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200',
      story: 'From sacred rituals to opulent reception galas, we curate majestic weddings steeped in tradition, exquisite florals, and modern elegance.',
      images: [
        { id: 'f-exp-1', image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200', alt_text: 'Wedding Stage Decor' },
        { id: 'f-exp-2', image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200', alt_text: 'Mandap Celebration' },
        { id: 'f-exp-3', image_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200', alt_text: 'Lakeside Reception' },
      ],
    },
    {
      identifier: 'exp-2',
      title: 'Birthday & Anniversary',
      image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200',
      story: "Mark life's golden milestones with bespoke thematic decor, atmospheric mood lighting, and entertainment that charms every guest.",
      images: [
        { id: 'f-exp-4', image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200', alt_text: 'Milestone Celebration' },
        { id: 'f-exp-5', image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200', alt_text: 'Birthday Ambiance' },
      ],
    },
    {
      identifier: 'exp-3',
      title: 'Corporate Events',
      image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200',
      story: 'Flawless technical execution, executive stage design, and turnkey audio-visual logistics for summits, conferences, and awards nights.',
      images: [
        { id: 'f-exp-6', image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200', alt_text: 'Corporate Stage' },
        { id: 'f-exp-7', image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200', alt_text: 'Gala Dinner' },
      ],
    },
  ];

  const displayList = expertiseItems.length > 0 ? expertiseItems : fallbackExpertise;

  return (
    <div className="home-expertise-section bg-light">
      <div className="container">
        <div className="elegant-section-header">
          <span className="section-kicker">— OUR EXPERTISE</span>
          <h2 className="elegant-section-title">End-to-end event planning, tailored to your vision.</h2>
        </div>

        <div className="grid-3">
          {displayList.map((item, index) => (
            <div
              key={item.identifier || item.id || index}
              className="image-card relative overflow-hidden"
              onClick={() => setSelectedExpertise(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedExpertise(item)}
              style={{ cursor: 'pointer' }}
              aria-label={`View ${item.title || 'Expertise'}`}
            >
              <Image
                src={item.image_url || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800'}
                alt={item.title || 'Our Expertise'}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="card-overlay relative z-10"></div>
              <div className="card-content relative z-10">
                <span className="card-kicker image-card-kicker">Explore Gallery &rarr;</span>
                <h3 className="card-title image-card-title">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Luxury Multi-Image Gallery Modal for Expertise */}
      <LuxuryGalleryModal
        isOpen={!!selectedExpertise}
        onClose={() => setSelectedExpertise(null)}
        item={selectedExpertise}
        kicker="OUR EXPERTISE"
      />
    </div>
  );
}
