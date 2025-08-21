import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({ message: 'Logged out successfully' });
    
    // Clear both agency and user HTTP-only cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      expires: new Date(0), // Expire immediately
      path: '/'
    };

    response.cookies.set('agencyToken', '', cookieOptions);
    response.cookies.set('userToken', '', cookieOptions);
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
} 