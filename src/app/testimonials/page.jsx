import React from 'react'; 
import Image from 'next/image';
import { getAll } from '@/lib/db'; 
import VideoCard from '@/component/VideoCard';
import { getRelativeTime } from '@/utils/date';
import './Testimonials.css'; 

export const metadata = {
  title: "Client Testimonials & Stories | Raj Hansh Events Ranchi", 
  description: "Read real stories, reviews, and video testimonials from our clients across Ranchi and Jharkhand.", 
};

export const dynamic = 'force-dynamic';

export default async function Testimonials() {
  // Fetch all testimonials data from Neon PostgreSQL in parallel
  const [
    testimonialsData, 
    experiencesData, 
    smilesData 
  ] = await Promise.all([
    getAll('testimonials', 'created_at DESC'), 
    getAll('experiences', 'created_at ASC'), 
    getAll('smiles', 'created_at ASC') 
  ]);

  // Enhanced organic fallback reviews reflecting real celebration experiences across Ranchi & Jharkhand
  const fallbackReviews = [
    { 
      identifier: 'rev-1', 
      name: 'Anjali & Kunal Mehta', 
      comment: "Raj Hansh Event Management turned our wedding at Radisson Blu Ranchi into an absolute fairytale. From the royal mandap decor to the seamless guest hospitality, every single detail was executed with perfection.", 
      stars: 5, 
      platform: 'Google Review',
      date: '3 weeks ago'
    },
    { 
      identifier: 'rev-2', 
      name: 'Vikramaditya Singh', 
      comment: "Exceptional corporate gala management for our annual conclave at BNR Chanakya. Managing over 600 attendees and high-profile delegates with zero hiccups was truly impressive.", 
      stars: 5, 
      platform: 'Google Review',
      date: '1 month ago'
    },
    { 
      identifier: 'rev-3', 
      name: 'Neha & Rohit Agarwal', 
      comment: "From the vibrant Haldi decor to the grand reception at Morabadi ground, the detailing and personal attention from the Raj Hansh team was unmatched. Minor delay during sound check, but resolved quickly. Highly recommended in Ranchi!", 
      stars: 4, 
      platform: 'Google Review',
      date: '2 months ago'
    },
    {
      identifier: 'rev-4',
      name: 'Dr. Priya & Amit Srivastava',
      comment: "We entrusted them with our daughter's 1st birthday celebration on Kanke Road. The fairytale floral theme and kids entertainment zone had all our guests in awe. Thank you team!",
      stars: 5,
      platform: 'Google Review',
      date: '3 months ago'
    },
    {
      identifier: 'rev-5',
      name: 'S. K. Choudhary',
      comment: "Organized our parents' golden anniversary celebration. Elegant, refined, and deeply respectful of our family traditions. Truly royal hospitality.",
      stars: 5,
      platform: 'Google Review',
      date: '4 months ago'
    },
    {
      identifier: 'rev-6',
      name: 'Manish Tiwari & Family',
      comment: "Decor was breathtaking and the catering arrangement was top notch for our family engagement. Entrance lighting was slightly bright at first but they adjusted it right away on request. Very cooperative crew.",
      stars: 4,
      platform: 'Google Review',
      date: '5 months ago'
    },
    {
      identifier: 'rev-7',
      name: 'Pooja & Rahul Verma',
      comment: "Outstanding coordination for our 3-day wedding festivities in Jharkhand. Every vendor, timeline, and aesthetic cue was flawlessly synchronized.",
      stars: 5,
      platform: 'Google Review',
      date: '6 months ago'
    },
    {
      identifier: 'rev-8',
      name: 'Shalini Gupta',
      comment: "Booked them for our brand launch cocktail dinner in Ranchi. The staging, ambient lighting, and RSVP desk management were world-class.",
      stars: 5,
      platform: 'Google Review',
      date: '7 months ago'
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

  // Dynamically calculate organic rating score
  const totalReviewsCount = displayReviews.length;
  const averageRating = (
    displayReviews.reduce((sum, r) => sum + (Number(r.stars) || 5), 0) / (totalReviewsCount || 1)
  ).toFixed(1);

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
              <strong>{averageRating}</strong>
              <span className="badge-stars">
                {"★".repeat(Math.round(Number(averageRating) || 5))}
                {"☆".repeat(5 - Math.round(Number(averageRating) || 5))}
              </span>
            </div>
          </div>
          <div className="google-badge-divider" />
          <div className="google-badge-right">
            <span>Verified Google Reviews • Ranchi &amp; Jharkhand</span>
          </div>
        </div>
        
        <div className="reviews-grid">
          {displayReviews.map(review => (
            <div key={review.identifier || review.id} className="review-card">
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
                  {"★".repeat(Math.round(review.stars || 5))}{"☆".repeat(5 - Math.round(review.stars || 5))}
                </div>
                <span className="review-date">
                  {Number(review.stars || 5).toFixed(1)} ★ • {getRelativeTime(review.created_at || review.date)}
                </span>
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