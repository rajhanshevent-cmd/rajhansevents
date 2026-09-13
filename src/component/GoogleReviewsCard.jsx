'use client';

import React, { useState } from 'react';
import { GOOGLE_REVIEWS_URL, GOOGLE_WRITE_REVIEW_URL, GOOGLE_MAPS_URL } from '@/lib/googleReviews';
import './GoogleReviewsCard.css';

/**
 * ReviewCard item component
 */
export function ReviewCardItem({ review }) {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!review) return null;
  const stars = Math.min(5, Math.max(1, Math.round(Number(review.rating || review.stars) || 5)));
  const authorName = review.author_name || review.name || 'Verified Client';
  const text = review.text || review.comment || '';
  const isLong = text.length > 150;
  const date = review.relative_time_description || review.date || 'Recent';
  const authorUrl = review.author_url || GOOGLE_REVIEWS_URL;
  const avatar = review.profile_photo_url || review.avatar;

  return (
    <div className="grc-review-item">
      <div className="grc-item-header">
        <a
          href={authorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="grc-avatar-link"
          title={`View ${authorName}'s review on Google`}
          aria-label={`View ${authorName}'s review on Google`}
        >
          {avatar ? (
            <img src={avatar} alt={authorName} className="grc-avatar-img" loading="lazy" />
          ) : (
            <div className="grc-avatar-placeholder">
              {authorName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="grc-avatar-google-badge">
            <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
          </span>
        </a>

        <div className="grc-author-info">
          <a
            href={authorUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="grc-author-name"
          >
            {authorName}
          </a>
          <span className="grc-review-meta">
            <span className="grc-stars">
              {"★".repeat(stars)}
              {"☆".repeat(5 - stars)}
            </span>
            <span className="grc-dot">•</span>
            <span className="grc-date">{date}</span>
          </span>
        </div>
      </div>

      <div className="grc-review-body">
        <div className={`grc-review-text-wrap ${isExpanded ? 'expanded' : 'clamped'}`}>
          <p className="grc-review-text">&ldquo;{text}&rdquo;</p>
        </div>
        {isLong && (
          <button
            type="button"
            className="grc-toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Show less ▴' : 'Read more ▾'}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * ReviewList component: renders up to 5 reviews
 */
export function ReviewList({ reviews = [] }) {
  const displayReviews = (Array.isArray(reviews) ? reviews : []).slice(0, 5);

  if (displayReviews.length === 0) {
    return (
      <div className="grc-empty-state">
        <p>No Google reviews available at this moment.</p>
      </div>
    );
  }

  return (
    <div className="grc-reviews-list">
      {displayReviews.map((review, i) => (
        <ReviewCardItem key={review.identifier || review.id || i} review={review} />
      ))}
    </div>
  );
}

/**
 * GoogleReviewsCard: Modular, pluggable component displaying:
 * 1. Overall business rating & total review count
 * 2. Up to 5 reviews (Author name, avatar, star rating, review text, relative date)
 * 3. Standard Google Places attribution ("Powered by Google")
 */
export default function GoogleReviewsCard({
  data = null,
  title = "Client Reviews on Google",
  className = ""
}) {
  const rating = Number(data?.rating || 5.0).toFixed(1);
  const totalReviews = Number(data?.user_ratings_total || data?.reviews?.length || 48);
  const reviews = (data?.reviews || []).slice(0, 5);

  return (
    <div className={`google-reviews-card-container ${className}`}>
      {/* Header with Overall Rating & Google Attribution */}
      <div className="grc-header">
        <div className="grc-header-left">
          <h3 className="grc-title">{title}</h3>
          <div className="grc-rating-summary">
            <span className="grc-score-num">{rating}</span>
            <span className="grc-score-stars">
              {"★".repeat(Math.round(Number(rating)))}
              {"☆".repeat(5 - Math.round(Number(rating)))}
            </span>
            <span className="grc-score-count">
              ({totalReviews} Google Reviews)
            </span>
          </div>
        </div>

        {/* Standard Google Places Attribution */}
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="grc-attribution-link"
          title="View on Google Maps"
        >
          <span className="grc-powered-text">Powered by</span>
          <svg width="64" height="22" viewBox="0 0 74 24" aria-label="Google" role="img">
            <path fill="#4285F4" d="M9.24 10.87v2.85h4.63c-.19 1.22-.72 2.25-1.63 3.03-1.04.88-2.48 1.41-4.63 1.41-3.69 0-6.7-2.99-6.7-6.68s3.01-6.68 6.7-6.68c1.99 0 3.46.78 4.54 1.8l2.02-2.02C12.7.99 10.37 0 7.61 0 3.48 0 0 3.47 0 7.6s3.48 7.6 7.61 7.6c2.25 0 3.96-.74 5.3-2.12 1.38-1.38 1.82-3.32 1.82-4.91 0-.47-.04-.92-.1-1.3H9.24z"/>
            <path fill="#EA4335" d="M23.2 4.9c-3.1 0-5.6 2.4-5.6 5.6s2.5 5.6 5.6 5.6c3.1 0 5.6-2.4 5.6-5.6s-2.5-5.6-5.6-5.6zm0 8.9c-1.7 0-3.2-1.4-3.2-3.3s1.5-3.3 3.2-3.3 3.2 1.4 3.2 3.3-1.5 3.3-3.2 3.3z"/>
            <path fill="#FBBC05" d="M35.6 4.9c-3.1 0-5.6 2.4-5.6 5.6s2.5 5.6 5.6 5.6c3.1 0 5.6-2.4 5.6-5.6s-2.5-5.6-5.6-5.6zm0 8.9c-1.7 0-3.2-1.4-3.2-3.3s1.5-3.3 3.2-3.3 3.2 1.4 3.2 3.3-1.5 3.3-3.2 3.3z"/>
            <path fill="#4285F4" d="M47.7 5.2v.9c-.7-.8-1.8-1.4-3.2-1.4-2.9 0-5.5 2.5-5.5 5.7 0 3.1 2.6 5.7 5.5 5.7 1.4 0 2.5-.6 3.2-1.5v.9c0 2.2-1.2 3.3-3.1 3.3-1.6 0-2.5-1.1-2.9-2.1l-2.1.9c.6 1.5 2.3 3.3 5 3.3 2.9 0 5.3-1.7 5.3-5.8V5.2h-2.2zm-2.9 8.6c-1.7 0-3-1.4-3-3.3 0-1.9 1.3-3.3 3-3.3 1.6 0 2.9 1.4 2.9 3.3 0 1.9-1.3 3.3-2.9 3.3z"/>
            <path fill="#34A853" d="M54.5.5h2.4v15.2h-2.4z"/>
            <path fill="#EA4335" d="M63.7 13.8c-1.2 0-2.1-.6-2.7-1.7l7.3-3-.2-.6c-.5-1.3-2-3.6-5.1-3.6-3.1 0-5.6 2.4-5.6 5.6 0 3.1 2.5 5.6 5.6 5.6 2.5 0 3.9-1.5 4.5-2.4l-1.9-1.2c-.6.8-1.4 1.3-2.4 1.3zm-.1-6.6c1 0 1.9.5 2.2 1.3l-5.3 2.2c0-2.5 1.8-3.5 3.1-3.5z"/>
          </svg>
        </a>
      </div>

      {/* Review List (Up to 5 reviews) */}
      <ReviewList reviews={reviews} />

      {/* Footer Actions */}
      <div className="grc-footer">
        <a
          href={GOOGLE_WRITE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="grc-btn-write"
        >
          Write a Review
        </a>
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="grc-btn-view-all"
        >
          View on Google Maps →
        </a>
      </div>
    </div>
  );
}
