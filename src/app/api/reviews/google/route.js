import { NextResponse } from 'next/server';
import { fetchGoogleReviews } from '@/lib/googleReviews';
import { getAll } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request ? request.url : 'http://localhost/api/reviews/google');
    const forceRefresh = searchParams.get('refresh') === 'true';

    const dbReviews = await getAll('testimonials', 'created_at DESC').catch(() => []);
    const result = await fetchGoogleReviews(dbReviews, 6, { forceRefresh });
    return NextResponse.json(
      {
        success: true,
        ...result
      },
      {
        headers: {
          'Cache-Control': forceRefresh
            ? 'no-store, no-cache, must-revalidate'
            : 'public, s-maxage=3600, stale-while-revalidate=1800'
        }
      }
    );
  } catch (error) {
    console.error('Error in /api/reviews/google:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
