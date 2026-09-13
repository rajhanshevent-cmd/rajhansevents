import { NextResponse } from 'next/server';
import { fetchGoogleReviews } from '@/lib/googleReviews';
import { getAll } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const dbReviews = await getAll('testimonials', 'created_at DESC').catch(() => []);
    const result = await fetchGoogleReviews(dbReviews, 6);
    return NextResponse.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error in /api/reviews/google:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
