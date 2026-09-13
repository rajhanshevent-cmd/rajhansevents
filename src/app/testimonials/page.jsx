import React from 'react'; 
import Image from 'next/image';
import { getAll } from '@/lib/db'; 
import VideoCard from '@/component/VideoCard';
import GoogleReviewsSection from '@/component/sections/GoogleReviewsSection';
import { fetchGoogleReviews } from '@/lib/googleReviews';
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

  // Import Google reviews (Google API -> Database -> Fallbacks)
  const googleReviewsData = await fetchGoogleReviews(testimonialsData, 6);

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
  const displayVideos = experiencesData && experiencesData.length > 0 ? experiencesData : fallbackVideos; 
  const displayPhotos = smilesData && smilesData.length > 0 ? smilesData : fallbackPhotos; 

  return (
    <div className="testimonials-page">
      
      {/* --- Section 1: Google Reviews (6 Evenly Placed Cards) --- */}
      <GoogleReviewsSection testimonialsData={testimonialsData} reviewsData={googleReviewsData} />

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