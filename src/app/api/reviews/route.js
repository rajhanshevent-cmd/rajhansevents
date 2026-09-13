import { NextResponse } from 'next/server';
import { getGooglePlacesReviews } from '@/lib/googleReviews';

export const dynamic = 'force-dynamic';

/**
 * GET /api/reviews
 *
 * Query Params:
 * - ?mock=true: Returns mock payload without hitting external Google API
 * - ?refresh=true: Bypasses the 24-hour cache and requests fresh data from Google Places API
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const useMock = searchParams.get('mock') === 'true';
    const forceRefresh = searchParams.get('refresh') === 'true';

    const data = await getGooglePlacesReviews({ forceRefresh, useMock });

    return NextResponse.json(
      {
        success: true,
        ...data
      },
      {
        headers: {
          // Standard browser/CDN cache control aligned with 24-hour cache
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
        }
      }
    );
  } catch (error) {
    console.error('[API /api/reviews] Unhandled exception:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve Google Places reviews',
        message: error.message
      },
      { status: 500 }
    );
  }
}
