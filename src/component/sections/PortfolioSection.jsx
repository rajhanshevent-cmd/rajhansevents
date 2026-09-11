'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import LuxuryGalleryModal from '@/component/LuxuryGalleryModal';
import '@/app/portfolio/Portfolio.css';

export default function PortfolioSection({ id = "portfolio" }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  
  // Luxury Modal State
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPortfolio = async () => {
      try {
        const res = await fetch('/api/portfolio');
        const json = await res.json();
        const data = json.data;

        if (data && isMounted) {
          setProjects(data);

          const uniqueCategories = ['All', ...new Set(data.map(item => item.category))].filter(Boolean);

          if (uniqueCategories.length > 1) {
            setCategories(uniqueCategories);
          } else {
            setCategories(['All', 'Weddings', 'Corporate', 'Social', 'Destination']);
          }
        }
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPortfolio();

    return () => {
      isMounted = false;
    };
  }, []);

  const closeModal = useCallback(() => {
    setSelectedMedia(null);
  }, []);

  const fallbackProjects = [
    {
      id: 1,
      title: 'Wedding',
      category: 'Weddings',
      media_type: 'image',
      media_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200',
      story: 'From intimate ceremonies to grand celebrations, we create unforgettable wedding experiences tailored to your love story.',
      images: [
        { id: 'fb-w-1', image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200' },
        { id: 'fb-w-2', image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200' },
        { id: 'fb-w-3', image_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200' },
        { id: 'fb-w-4', image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200' },
        { id: 'fb-w-5', image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200' }
      ]
    },
    {
      id: 2,
      title: 'TechCorp Summit',
      category: 'Corporate',
      media_type: 'image',
      media_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200',
      story: 'Executive summits and international corporate galas planned with technical precision and architectural grace.',
      images: [
        { id: 'fb-c-1', image_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200' },
        { id: 'fb-c-2', image_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200' }
      ]
    },
    {
      id: 3,
      title: 'Sharma Anniversary',
      category: 'Social',
      media_type: 'image',
      media_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200',
      story: 'Milestone romantic anniversary celebrations designed with opulent floral decor and warm candlelit ambiences.',
    },
    {
      id: 4,
      title: 'Udaipur Palace Wedding',
      category: 'Destination',
      media_type: 'image',
      media_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200',
      story: 'Palatial destination wedding orchestrated across 3 days with royal procession, lakeside mandap, and sangeet night.',
    },
    {
      id: 5,
      title: 'Celebration of Joy',
      category: 'Weddings',
      media_type: 'image',
      media_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200',
      story: 'A heartfelt union celebrated with royal hospitality, fine dining delicacies, and signature stage installations.',
    },
    {
      id: 6,
      title: 'Milestone Gala',
      category: 'Corporate',
      media_type: 'image',
      media_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200',
      story: 'Award-winning gala nights featuring bespoke lighting production, red carpet arrivals, and keynote stages.',
    },
  ];

  const displayProjects = projects.length > 0 ? projects : fallbackProjects;

  const filteredProjects = activeFilter === 'All'
    ? displayProjects
    : displayProjects.filter(p => p.category === activeFilter);

  const skeletonArray = Array.from({ length: 6 });

  const handleOpenModal = (project) => {
    setSelectedMedia(project);
    setActiveImgIndex(0);
  };

  return (
    <section id={id} className="portfolio-container continuous-section">
      {/* Section Header */}
      <div className="elegant-section-header">
        <span className="section-kicker">— OUR PORTFOLIO</span>
        <h2 className="elegant-section-title">A glimpse into the extraordinary moments we&apos;ve crafted.</h2>
      </div>

      {/* Interactive Category Filter Pills */}
      <div className="filters" role="tablist" aria-label="Portfolio categories">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={activeFilter === cat}
            className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
            onClick={() => setActiveFilter(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Portfolio Grid */}
      <div className="portfolio-grid">
        {loading ? (
          skeletonArray.map((_, index) => (
            <div key={`skeleton-${index}`} className="skeleton-card" />
          ))
        ) : (
          filteredProjects.map(project => (
            <div
              key={project.identifier || project.id}
              className="portfolio-card"
              onClick={() => handleOpenModal(project)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleOpenModal(project)}
              aria-label={`View ${project.title || "portfolio item"}`}
            >
              {project.media_type === 'video' ? (
                <video
                  src={project.thumbnail_url || project.media_url}
                  poster={project.thumbnail_url}
                  className="portfolio-media"
                  muted
                  playsInline
                  preload="none"
                />
              ) : (
                <Image
                  src={project.thumbnail_url || project.media_url || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800'}
                  alt={project.title || "Portfolio showcase"}
                  fill
                  loading="lazy"
                  quality={75}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  className="portfolio-media"
                />
              )}

              <div className="portfolio-overlay">
                <div className="portfolio-info">
                  <span className="portfolio-category">{project.category}</span>
                  <h3 className="portfolio-project-title">{project.title || project.identifier || "Gallery Item"}</h3>
                  <span className="view-detail-hint">Explore Gallery &rarr;</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Luxury Multi-Image Gallery Modal */}
      <LuxuryGalleryModal
        isOpen={!!selectedMedia}
        onClose={closeModal}
        item={selectedMedia}
        kicker="OUR EVENTS"
      />
    </section>
  );
}
