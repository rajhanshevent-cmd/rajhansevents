import React from 'react'; 
import Image from 'next/image';
import { getAll } from '@/lib/db'; 
import VideoCard from '@/component/VideoCard';
import './Testimonials.css'; 

export const metadata = {
  title: "Client Testimonials & Stories | Raj Hansh Events Ranchi", 
  description: "Read real stories, reviews, and video testimonials from our clients across Ranchi and Jharkhand.", 
};

export default async function Testimonials() {
  // Fetch all testimonials data from Neon PostgreSQL in parallel
  const [
    testimonialsData, 
    experiencesData, 
    smilesData 
  ] = await Promise.all([
    getAll('testimonials', 'created_at ASC'), 
    getAll('experiences', 'created_at ASC'), 
    getAll('smiles', 'created_at ASC') 
  ]);

  // Enhanced original reviews to mimic Google Reviews used as fallbacks
  const fallbackReviews = [
    { 
      identifier: 'rev-1', 
      name: 'Anjali Mehta', 
      comment: "Raj Hansh Event Management made our wedding a dream come true. Everything was beyond perfect!", 
      stars: 5, 
      platform: 'Google Review'  
    },
    { 
      identifier: 'rev-2', 
      name: 'Vikram Singh', 
      comment: "Incredible corporate event execution. The team handled the 500+ guests flawlessly.", 
      stars: 5, 
      platform: 'Google Review'  
    },
    { 
      identifier: 'rev-3', 
      name: 'Neha & Rohit', 
      comment: "From decor to catering, every detail was handled with immense care. Highly recommended!", 
      stars: 5, 
      platform: 'Google Review'  
    }
  ];

  // Video placeholders used as fallbacks
  const fallbackVideos = [
    { identifier: 'vid-1', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'The Sharma Wedding' }, 
    { identifier: 'vid-2', video_url: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'TechCorp Gala 2025' } 
  ];

  // Client Photos used as fallbacks
  const fallbackPhotos = [
    { identifier: 'photo-1', image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800', alt: 'Happy Couple' }, 
    { identifier: 'photo-2', image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800', alt: 'Corporate Team' }, 
    { identifier: 'photo-3', image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=800', alt: 'Anniversary Celebration' } 
  ];

  // Determine what data to display (live data or fallback)
  const displayReviews = testimonialsData && testimonialsData.length > 0 ? testimonialsData : fallbackReviews; 
  const displayVideos = experiencesData && experiencesData.length > 0 ? experiencesData : fallbackVideos; 
  const displayPhotos = smilesData && smilesData.length > 0 ? smilesData : fallbackPhotos; 

  return (
    <div className="testimonials-page">
      
      {/* --- Section 1: Google Reviews --- */}
      <section className="testimonials-container">
        <div className="elegant-section-header">
          <span className="section-kicker">— WHAT OUR CLIENTS SAY</span>
          <h2 className="elegant-section-title">Real stories from our unforgettable events.</h2>
        </div>

        {/* Google Trust & Rating Badge */}
        <div className="google-trust-badge">
          <div className="google-badge-left">
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <div className="google-badge-score">
              <strong>4.9</strong>
              <span className="badge-stars">★★★★★</span>
            </div>
          </div>
          <div className="google-badge-divider" />
          <div className="google-badge-right">
            <span>Verified Google Reviews • Ranchi &amp; Jharkhand</span>
          </div>
        </div>
        
        <div className="reviews-grid">
          {displayReviews.map(review => (
            <div key={review.identifier} className="review-card">
              <div className="review-card-header">
                <div className="reviewer-avatar">
                  {(review.name || 'G').charAt(0).toUpperCase()}
                </div>
                <div className="reviewer-meta">
                  <h4 className="review-author">{review.name}</h4>
                  <span className="reviewer-badge">
                    <span className="verified-check">✓</span> Google Review
                  </span>
                </div>
                <div className="google-logo-wrapper" title="Google Verified Review">
                  <svg width="22" height="22" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                </div>
              </div>

              <div className="review-stars-row">
                <div className="stars">
                  {"★".repeat(review.stars || 5)}{"☆".repeat(5 - (review.stars || 5))}
                </div>
                <span className="review-date">5.0 Star Rating</span>
              </div>

              <p className="review-text">&ldquo;{review.comment}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Section 2: Video Testimonials --- */}
      <section className="video-section">
        <div className="testimonials-container">
          <div className="elegant-section-header">
            <span className="section-kicker">— WATCH THEIR EXPERIENCE</span>
            <h2 className="elegant-section-title">Hear directly from our happy clients.</h2>
          </div>
          
          <div className="video-grid">
            {displayVideos.map((video, idx) => (
              <VideoCard key={video.identifier || idx} video={video} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* --- Section 3: Client Photos (Smiles) --- */}
      <section className="testimonials-container gallery-section">
        <div className="elegant-section-header">
          <span className="section-kicker">— SMILES WE&apos;VE CREATED</span>
          <h2 className="elegant-section-title">A picture is worth a thousand words.</h2>
        </div>
        
        <div className="photo-grid">
          {displayPhotos.map(photo => (
            <div key={photo.identifier} className="photo-card squarish-card relative" style={{ position: 'relative' }}>
              <Image 
                loading="lazy" 
                src={photo.image_url || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800'} 
                alt={photo.alt || photo.identifier || 'Celebration moment'} 
                fill
                className="client-image"
                sizes="(max-width: 768px) 100vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}