'use client';

import React, { useState } from 'react';
import {
  GOOGLE_REVIEWS_URL,
  GOOGLE_WRITE_REVIEW_URL,
  GOOGLE_MAPS_URL,
  selectBestReviews
} from '@/lib/googleReviews';

export { ReviewList, ReviewCardItem, default as GoogleReviewsCard } from '@/component/GoogleReviewsCard';

/**
 * Individual Review Card with expandable Show More / Show Less and smooth scroll
 */
function ReviewCardItemBox({ review }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const starsNum = Math.min(5, Math.max(4, Math.round(Number(review.stars || review.rating) || 5)));
  const reviewTargetUrl = review.author_url || GOOGLE_REVIEWS_URL;
  const reviewComment = review.comment || review.text || '';
  const isLong = reviewComment.length > 160;

  return (
    <div className={`review-card ${isExpanded ? 'is-expanded' : ''}`}>
      {/* Header with Clickable Google Button on the Left Corner */}
      <div className="review-card-header">
        <a
          href={reviewTargetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="google-corner-btn"
          title="Verified Google Review — Click to view authentic review on Google"
          aria-label="View authentic review on Google"
        >
          {review.avatar ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={review.avatar}
              alt={review.name}
              className="reviewer-avatar-img"
              loading="lazy"
            />
          ) : (
            <div className="reviewer-avatar">
              {(review.name || 'G').charAt(0).toUpperCase()}
            </div>
          )}
          {/* Google G icon badge on the left corner */}
          <span className="google-avatar-badge" title="Verified Google Review">
            <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
          </span>
        </a>

        <div className="reviewer-meta">
          <h4 className="review-author">{review.name}</h4>
          <a
            href={reviewTargetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="reviewer-badge-link"
            title="Click to view verified review on Google"
          >
            <span className="verified-check">✓</span> Google Review
          </a>
        </div>

        <a
          href={reviewTargetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="google-logo-wrapper"
          title="Verified Google Review — Click to View on Google"
          aria-label="View on Google"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
            <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
          </svg>
        </a>
      </div>

      {/* Stars Row with Whole Integer Rating */}
      <div className="review-stars-row">
        <div className="stars" aria-label={`${starsNum} out of 5 stars`}>
          <span className="filled-stars">{"★".repeat(starsNum)}</span>
          {starsNum < 5 && <span className="empty-stars">{"☆".repeat(5 - starsNum)}</span>}
        </div>
        <span className="review-date">
          {starsNum} ★ • {review.date || 'Recent'}
        </span>
      </div>

      {/* Review Comment with Clamp, Scroll & Read More */}
      <div className="review-body-wrapper">
        <div className={`review-text-scroll ${isExpanded ? 'expanded' : 'clamped'}`}>
          <p className="review-text">&ldquo;{reviewComment}&rdquo;</p>
        </div>

        {isLong && (
          <button
            type="button"
            className="review-toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <>
                Show less <span className="toggle-arrow">▴</span>
              </>
            ) : (
              <>
                Read more <span className="toggle-arrow">▾</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Footer with Direct Link to Google Maps */}
      <div className="review-card-footer">
        <a
          href={reviewTargetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="review-source-tag"
          title="View authentic review on Google Maps"
        >
          <span className="google-dot">●</span> Verified on Google Maps
        </a>
        {review.eventType && (
          <span className="review-occasion-tag">{review.eventType}</span>
        )}
      </div>
    </div>
  );
}

export default function GoogleReviewsSection({
  testimonialsData = [],
  reviewsData = null,
  title = "Real stories from our unforgettable events.",
  kicker = "— WHAT OUR CLIENTS SAY",
  showHeading = true
}) {
  // Use passed reviews or select the best 6 from database/fallbacks
  const sixReviews = reviewsData?.reviews || selectBestReviews(testimonialsData, 6);

  // Calculate live rating score
  const totalCount = reviewsData?.totalRatings || sixReviews.length;
  const averageRating = reviewsData?.averageRating
    ? Number(reviewsData.averageRating).toFixed(1)
    : (
        sixReviews.reduce((sum, r) => sum + (Number(r.stars) || 5), 0) / (sixReviews.length || 1)
      ).toFixed(1);

  return (
    <div className="testimonials-container">
      {showHeading && (
        <div className="elegant-section-header">
          <span className="section-kicker">{kicker}</span>
          <h2 className="elegant-section-title">{title}</h2>
        </div>
      )}

      {/* Google Trust & Rating Badge (Clickable Left-Corner Google Button linking to Real Reviews) */}
      <div className="google-trust-badge">
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="google-badge-left google-badge-link"
          title="Verified Google Business Profile — Click to view authentic reviews on Google"
          aria-label="View verified Google reviews for Raj Hansh Events"
        >
          <div className="google-g-icon-wrapper">
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
          </div>
          <div className="google-badge-score">
            <strong>{averageRating}</strong>
            <span className="badge-stars">
              {"★".repeat(Math.round(Number(averageRating) || 5))}
              {"☆".repeat(5 - Math.round(Number(averageRating) || 5))}
            </span>
          </div>
        </a>

        <div className="google-badge-divider" />

        <div className="google-badge-right">
          <span>Verified Google Reviews • Ranchi &amp; Jharkhand</span>
        </div>
      </div>

      {/* Exactly Six Evenly Placed Review Cards */}
      <div className="reviews-grid">
        {sixReviews.map((review) => (
          <ReviewCardItemBox
            key={review.identifier || review.id}
            review={review}
          />
        ))}
      </div>

      {/* Google Reviews Action CTA Banner */}
      <div className="reviews-google-cta">
        <div className="google-cta-info">
          <div className="google-cta-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
          </div>
          <div>
            <h3 className="google-cta-title">Celebrated with Raj Hansh Events?</h3>
            <p className="google-cta-desc">Your stories inspire our team. Share your review on Google and help future hosts celebrate with peace of mind.</p>
          </div>
        </div>

        <div className="google-cta-buttons">
          <a
            href={GOOGLE_WRITE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-google-write"
          >
            WRITE A GOOGLE REVIEW <span>&rarr;</span>
          </a>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-google-all"
          >
            VIEW ALL GOOGLE REVIEWS
          </a>
        </div>
      </div>
    </div>
  );
}
