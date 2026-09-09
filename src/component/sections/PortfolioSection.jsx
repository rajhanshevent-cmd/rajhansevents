'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { supabase } from '@/utils/supabaseClient';
import '@/app/portfolio/Portfolio.css';

export default function PortfolioSection({ id = "portfolio" }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchPortfolio = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && isMounted) {
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

  const closeModal = useCallback(() => setSelectedMedia(null), []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal();
    };

    if (selectedMedia) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedMedia, closeModal]);

  const fallbackProjects = [
    { id: 1, title: 'The Royal Gala', category: 'Weddings', media_type: 'image', media_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200' },
    { id: 2, title: 'TechCorp Summit', category: 'Corporate', media_type: 'image', media_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200' },
    { id: 3, title: 'Sharma Anniversary', category: 'Social', media_type: 'image', media_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200' },
    { id: 4, title: 'Udaipur Palace Wedding', category: 'Destination', media_type: 'image', media_url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1200' },
    { id: 5, title: 'Celebration of Joy', category: 'Weddings', media_type: 'image', media_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200' },
    { id: 6, title: 'Milestone Gala', category: 'Corporate', media_type: 'image', media_url: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200' },
  ];

  const displayProjects = projects.length > 0 ? projects : fallbackProjects;

  const filteredProjects = activeFilter === 'All'
    ? displayProjects
    : displayProjects.filter(p => p.category === activeFilter);

  const skeletonArray = Array.from({ length: 6 });

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
              onClick={() => setSelectedMedia(project)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedMedia(project)}
              aria-label={`View ${project.title || "portfolio item"}`}
            >
              {project.media_type === 'video' ? (
                <video
                  src={project.thumbnail_url || project.media_url}
                  className="portfolio-media"
                  muted
                  playsInline
                />
              ) : (
                <Image
                  src={project.thumbnail_url || project.media_url}
                  alt={project.title || "Portfolio showcase"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  className="portfolio-media"
                />
              )}

              <div className="portfolio-overlay">
                <div className="portfolio-info">
                  <span className="portfolio-category">{project.category}</span>
                  <h3 className="portfolio-project-title">{project.title || project.identifier || "Gallery Item"}</h3>
                  <span className="view-detail-hint">Click to enlarge &rarr;</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Luxury Fullscreen Lightbox Modal */}
      {selectedMedia && (
        <div className="image-modal" onClick={closeModal} role="dialog" aria-modal="true">
          <button
            type="button"
            className="close-modal"
            onClick={closeModal}
            aria-label="Close modal"
          >
            &times;
          </button>

          <div
            className="modal-content-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.media_type === 'video' ? (
              <video
                src={selectedMedia.media_url}
                className="modal-image"
                controls
                autoPlay
              />
            ) : (
              <img
                src={selectedMedia.media_url}
                alt={selectedMedia.title || "Enlarged celebration photo"}
                className="modal-image"
              />
            )}

            <div className="modal-caption-bar">
              <div>
                <span className="modal-caption-category">{selectedMedia.category}</span>
                <h3 className="modal-caption-title">{selectedMedia.title || "Celebration Showcase"}</h3>
              </div>
              <button
                type="button"
                className="modal-close-action"
                onClick={closeModal}
              >
                Close (Esc)
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
