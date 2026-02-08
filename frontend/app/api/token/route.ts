import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

/**
 * GET /api/token
 *
 * Exchanges Better Auth session for a backend-compatible HS256 JWT token
 * This endpoint verifies the user's Better Auth session and generates a JWT
 * that the FastAPI backend can validate.
 */
export async function GET(request: NextRequest) {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Generate HS256 JWT token compatible with backend
    const jwt = require('jsonwebtoken');
    const secret = process.env.BETTER_AUTH_SECRET;

    if (!secret) {
      throw new Error('BETTER_AUTH_SECRET not configured');
    }

    const token = jwt.sign(
      {
        sub: session.user.id,
        email: session.user.email,
        name: session.user.name,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
        type: 'access'
      },
      secret,
      {
        algorithm: 'HS256'
      }
    );

    return NextResponse.json({
      token,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      }
    });

  } catch (error: any) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate token', details: error.message },
      { status: 500 }
    );
  }
}
