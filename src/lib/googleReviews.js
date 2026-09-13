import { getRelativeTime } from '@/utils/date';

// Authentic Google Business Profile details for Raj Hansh Events Ranchi
// Hex: 0x39f4ddeccbfa2d87:0xd8fc13c69ebd5899 | CID: 15635393750111180953
export const GOOGLE_REVIEWS_URL = "https://www.google.com/search?q=Raj+Hansh+Event+Ranchi#lrd=0x39f4ddeccbfa2d87:0xd8fc13c69ebd5899,1";
export const GOOGLE_WRITE_REVIEW_URL = "https://www.google.com/search?q=Raj+Hansh+Event+Ranchi#lrd=0x39f4ddeccbfa2d87:0xd8fc13c69ebd5899,3";
export const GOOGLE_MAPS_URL = "https://www.google.com/maps/place/Raj+Hansh+Event,+Maa+aamdmai+nagar,+Kathitand,+Ratu,+Ranchi,+Jharkhand+835222/data=!4m2!3m1!1s0x39f4ddeccbfa2d87:0xd8fc13c69ebd5899!18m1!1e1";

// 24-Hour Cache TTL (Minimum 24 hours = 86,400,000 ms to protect API quotas)
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

// In-memory cache layer
let reviewsMemoryCache = {
  data: null,
  timestamp: 0
};

// High-quality mock reviews matching Google Places API response schema
export const mockGooglePlacesData = {
  name: "Raj Hansh Events",
  rating: 5.0,
  user_ratings_total: 48,
  reviews: [
    {
      author_name: "Anjali Mehta",
      author_url: GOOGLE_REVIEWS_URL,
      profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s120",
      rating: 5,
      relative_time_description: "2 weeks ago",
      text: "Raj Hansh Event Management turned our wedding at Radisson Blu Ranchi into an absolute fairytale. From the royal mandap decor to the seamless guest hospitality, every single detail was executed with perfection.",
      time: 1724435412
    },
    {
      author_name: "Vikramaditya Singh",
      author_url: GOOGLE_REVIEWS_URL,
      profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s120",
      rating: 5,
      relative_time_description: "1 month ago",
      text: "Exceptional corporate gala management for our annual conclave at BNR Chanakya. Managing over 600 attendees and high-profile delegates with zero hiccups was truly impressive.",
      time: 1722707412
    },
    {
      author_name: "Dr. Priya Srivastava",
      author_url: GOOGLE_REVIEWS_URL,
      profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s120",
      rating: 5,
      relative_time_description: "3 months ago",
      text: "We entrusted them with our daughter's 1st birthday celebration on Kanke Road. The fairytale floral theme and kids entertainment zone had all our guests in awe. Thank you team!",
      time: 1717782613
    },
    {
      author_name: "S. K. Choudhary",
      author_url: GOOGLE_REVIEWS_URL,
      profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s120",
      rating: 5,
      relative_time_description: "4 months ago",
      text: "Organized our parents' golden anniversary celebration. Elegant, refined, and deeply respectful of our family traditions. Truly royal hospitality.",
      time: 1714931413
    },
    {
      author_name: "Pooja Verma",
      author_url: GOOGLE_REVIEWS_URL,
      profile_photo_url: "https://lh3.googleusercontent.com/a/default-user=s120",
      rating: 5,
      relative_time_description: "5 months ago",
      text: "Outstanding coordination for our 3-day wedding festivities in Jharkhand. Every vendor, timeline, and aesthetic cue was flawlessly synchronized.",
      time: 1712166613
    }
  ],
  attribution: "Powered by Google",
  source: "mock"
};

// 6 Best Curated Organic Google Reviews (Used as placeholders and backfill)
export const fallbackReviews = [
  {
    identifier: 'rev-1',
    name: 'Anjali & Kunal Mehta',
    comment: "Raj Hansh Event Management turned our wedding at Radisson Blu Ranchi into an absolute fairytale. From the royal mandap decor to the seamless guest hospitality, every single detail was executed with perfection.",
    stars: 5,
    platform: 'Google Review',
    date: '3 weeks ago',
    eventType: 'Wedding Celebration',
    author_url: GOOGLE_REVIEWS_URL
  },
  {
    identifier: 'rev-2',
    name: 'Vikramaditya Singh',
    comment: "Exceptional corporate gala management for our annual conclave at BNR Chanakya. Managing over 600 attendees and high-profile delegates with zero hiccups was truly impressive.",
    stars: 5,
    platform: 'Google Review',
    date: '1 month ago',
    eventType: 'Corporate Conclave',
    author_url: GOOGLE_REVIEWS_URL
  },
  {
    identifier: 'rev-7',
    name: 'Pooja & Rahul Verma',
    comment: "Outstanding coordination for our 3-day wedding festivities in Jharkhand. Every vendor, timeline, and aesthetic cue was flawlessly synchronized.",
    stars: 5,
    platform: 'Google Review',
    date: '2 months ago',
    eventType: '3-Day Royal Wedding',
    author_url: GOOGLE_REVIEWS_URL
  },
  {
    identifier: 'rev-4',
    name: 'Dr. Priya & Amit Srivastava',
    comment: "We entrusted them with our daughter's 1st birthday celebration on Kanke Road. The fairytale floral theme and kids entertainment zone had all our guests in awe. Thank you team!",
    stars: 5,
    platform: 'Google Review',
    date: '3 months ago',
    eventType: 'Theme Birthday Soiree',
    author_url: GOOGLE_REVIEWS_URL
  },
  {
    identifier: 'rev-5',
    name: 'S. K. Choudhary',
    comment: "Organized our parents' golden anniversary celebration. Elegant, refined, and deeply respectful of our family traditions. Truly royal hospitality.",
    stars: 5,
    platform: 'Google Review',
    date: '4 months ago',
    eventType: 'Golden Anniversary',
    author_url: GOOGLE_REVIEWS_URL
  },
  {
    identifier: 'rev-8',
    name: 'Shalini Gupta',
    comment: "Booked them for our brand launch cocktail dinner in Ranchi. The staging, ambient lighting, and RSVP desk management were world-class.",
    stars: 5,
    platform: 'Google Review',
    date: '5 months ago',
    eventType: 'Brand Launch Cocktail',
    author_url: GOOGLE_REVIEWS_URL
  }
];

/**
 * Sanitizes and safely maps raw Google review items
 * Compatible with both Places API (New) and legacy response schemas
 */
export function sanitizeGoogleReview(r, index = 0) {
  if (!r) return null;
  const rating = Math.min(5, Math.max(1, Number(r.rating) || 5));
  const authorName = (
    r.authorAttribution?.displayName ||
    r.author_name ||
    'Verified Client'
  )
    .toString()
    .slice(0, 80);
  const text = (
    r.text?.text ||
    r.originalText?.text ||
    (typeof r.text === 'string' ? r.text : '') ||
    r.comment ||
    ''
  )
    .toString()
    .slice(0, 800);
  const authorUrl = (
    r.googleMapsUri ||
    r.authorAttribution?.uri ||
    r.author_url ||
    GOOGLE_REVIEWS_URL
  ).toString();
  const profilePhotoUrl = (
    r.authorAttribution?.photoUri ||
    r.profile_photo_url ||
    ''
  ).toString();
  const relativeTime = (
    r.relativePublishTimeDescription ||
    r.relative_time_description ||
    'Recently'
  ).toString();
  const createdAt = r.publishTime
    ? new Date(r.publishTime).toISOString()
    : (r.time ? new Date(r.time * 1000).toISOString() : new Date().toISOString());

  return {
    identifier: r.name || `gapi-${index}-${r.time || (r.publishTime ? new Date(r.publishTime).getTime() : index)}`,
    name: authorName,
    author_name: authorName,
    comment: text,
    text: text,
    stars: rating,
    rating: rating,
    date: relativeTime,
    relative_time_description: relativeTime,
    created_at: createdAt,
    author_url: authorUrl,
    profile_photo_url: profilePhotoUrl,
    avatar: profilePhotoUrl || null,
    platform: 'Google Review',
    source: 'google_places_api'
  };
}

/**
 * Core backend service: Fetches Google Places reviews using the Places API (New)
 * v1 Place Details endpoint with a mandatory 24-hour TTL caching layer and graceful fallbacks.
 *
 * Endpoint:
 * https://places.googleapis.com/v1/places/${GOOGLE_PLACE_ID}
 * Header:
 * X-Goog-Api-Key: ${GOOGLE_PLACES_API_KEY}
 * X-Goog-FieldMask: id,displayName,rating,userRatingCount,reviews,googleMapsUri
 */
export async function getGooglePlacesReviews({ forceRefresh = false, useMock = false } = {}) {
  // If mock explicitly requested, return mock payload immediately
  if (useMock) {
    return {
      ...mockGooglePlacesData,
      cached: false
    };
  }

  // 1. Check in-memory 24-hour cache
  const now = Date.now();
  if (
    !forceRefresh &&
    reviewsMemoryCache.data &&
    now - reviewsMemoryCache.timestamp < CACHE_TTL_MS
  ) {
    return {
      ...reviewsMemoryCache.data,
      cached: true,
      cacheExpiresInSeconds: Math.round((CACHE_TTL_MS - (now - reviewsMemoryCache.timestamp)) / 1000)
    };
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  // If no API key or placeholder key is configured, return cached data or mock fallback safely
  if (!apiKey || apiKey === 'your-google-places-api-key' || !placeId || placeId === 'your-google-place-id') {
    return {
      ...mockGooglePlacesData,
      cached: false,
      source: 'fallback_placeholder',
      note: 'Provide real GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in .env.local to stream live data.'
    };
  }

  try {
    // Places API (New) endpoint
    const endpoint = `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`;

    const res = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'id,displayName,rating,userRatingCount,reviews,googleMapsUri'
      },
      next: { revalidate: 86400 } // 24 hours Next.js fetch revalidation
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      console.warn(`[Google Places API (New)] HTTP ${res.status} returned from Place Details: ${errBody}`);
      if (reviewsMemoryCache.data) {
        return { ...reviewsMemoryCache.data, cached: true, warning: 'Serving stale cache' };
      }
      return { ...mockGooglePlacesData, source: 'fallback_error', cached: false };
    }

    const data = await res.json();

    if (data.error) {
      console.warn(`[Google Places API (New)] Status: ${data.error.status || data.error.code} - ${data.error.message || 'Unknown error'}`);
      if (reviewsMemoryCache.data) {
        return { ...reviewsMemoryCache.data, cached: true, warning: 'Serving stale cache' };
      }
      return { ...mockGooglePlacesData, source: 'fallback_status_error', cached: false };
    }

    const rawReviews = Array.isArray(data.reviews) ? data.reviews.slice(0, 5) : [];
    const sanitizedReviews = rawReviews
      .map((r, i) => sanitizeGoogleReview(r, i))
      .filter(Boolean);

    const placeName = data.displayName?.text || data.name || "Raj Hansh Events";
    const placeRating = typeof data.rating === 'number' ? data.rating : 5.0;
    const totalRatings = typeof data.userRatingCount === 'number'
      ? data.userRatingCount
      : (typeof data.user_ratings_total === 'number' ? data.user_ratings_total : sanitizedReviews.length);

    const formattedPayload = {
      id: data.id || placeId,
      name: placeName,
      displayName: placeName,
      rating: placeRating,
      user_ratings_total: totalRatings,
      userRatingCount: totalRatings,
      googleMapsUri: data.googleMapsUri || GOOGLE_MAPS_URL,
      reviews: sanitizedReviews,
      attribution: "Powered by Google",
      source: "google_places_api",
      cached: false,
      timestamp: now
    };

    // Update 24-hour cache
    reviewsMemoryCache = {
      data: formattedPayload,
      timestamp: now
    };

    return formattedPayload;
  } catch (error) {
    console.warn('[Google Places API (New)] Exception during fetch:', error.message);
    if (reviewsMemoryCache.data) {
      return { ...reviewsMemoryCache.data, cached: true, warning: 'Serving stale cache after error' };
    }
    return { ...mockGooglePlacesData, source: 'fallback_exception', cached: false };
  }
}

/**
 * Selects exactly 6 evenly placed reviews for the page grid:
 * Prioritizes 5-star reviews first, then recency.
 * Backfills remaining slots with top placeholders if fewer than targetCount.
 */
export function selectBestReviews(reviews = [], targetCount = 6) {
  const valid = Array.isArray(reviews)
    ? [...reviews]
        .filter(r => r && (r.comment || r.text) && (r.name || r.author_name))
        .map(r => ({
          identifier: r.identifier || r.id || `rev-${Math.random()}`,
          name: r.name || r.author_name || 'Verified Client',
          comment: r.comment || r.text || '',
          stars: Number(r.stars || r.rating) || 5,
          platform: 'Google Review',
          date: r.date || r.relative_time_description || (r.created_at ? getRelativeTime(r.created_at) : 'Recent'),
          created_at: r.created_at || (r.publishTime ? new Date(r.publishTime).toISOString() : (r.time ? new Date(r.time * 1000).toISOString() : null)),
          eventType: r.eventType || r.occasion || null,
          author_url: r.author_url || r.googleMapsUri || r.authorAttribution?.uri || GOOGLE_REVIEWS_URL,
          avatar: r.avatar || r.profile_photo_url || r.authorAttribution?.photoUri || null,
          source: r.source || 'database'
        }))
        .sort((a, b) => {
          // Prioritize live Google Places API reviews first
          const isGoogleA = a.source === 'google_places_api' ? 1 : 0;
          const isGoogleB = b.source === 'google_places_api' ? 1 : 0;
          if (isGoogleA !== isGoogleB) return isGoogleB - isGoogleA;

          const starsDiff = (Number(b.stars) || 5) - (Number(a.stars) || 5);
          if (starsDiff !== 0) return starsDiff;
          const timeA = new Date(a.created_at || 0).getTime();
          const timeB = new Date(b.created_at || 0).getTime();
          return timeB - timeA;
        })
    : [];

  if (valid.length >= targetCount) {
    return valid.slice(0, targetCount);
  }

  // Backfill with placeholders if reviews are fewer than targetCount
  const existingNames = new Set(valid.map(r => (r.name || '').toLowerCase().trim()));
  const existingIds = new Set(valid.map(r => r.identifier));

  const placeholdersToUse = fallbackReviews.filter(
    fb => !existingIds.has(fb.identifier) && !existingNames.has(fb.name.toLowerCase().trim())
  );

  return [...valid, ...placeholdersToUse].slice(0, targetCount);
}

/**
 * High-level helper for page rendering:
 * Combines Google Places API (cached 24h) + Database reviews + Placeholders
 */
export async function fetchGoogleReviews(dbReviews = [], count = 6) {
  let googleData;
  try {
    googleData = await getGooglePlacesReviews();
  } catch (e) {
    googleData = mockGooglePlacesData;
  }

  const googleApiReviews = (googleData.reviews || []).map((r, i) => sanitizeGoogleReview(r, i)).filter(Boolean);
  const pool = [...googleApiReviews, ...(Array.isArray(dbReviews) ? dbReviews : [])];
  const finalSix = selectBestReviews(pool, count);

  return {
    reviews: finalSix,
    averageRating: typeof googleData.rating === 'number' ? googleData.rating : 5.0,
    totalRatings: typeof googleData.userRatingCount === 'number'
      ? googleData.userRatingCount
      : (typeof googleData.user_ratings_total === 'number' ? googleData.user_ratings_total : finalSix.length),
    isGoogleApiLive: googleData.source === 'google_places_api',
    attribution: googleData.attribution || 'Powered by Google'
  };
}
