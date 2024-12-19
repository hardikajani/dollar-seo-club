import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { cookies } from 'next/headers';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Code not provided' }, { status: 400 });
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    if (tokens.access_token) {
      cookies().set('access_token', tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600 // 1 hour, adjust as needed
      });
    }

    if (tokens.refresh_token) {
      cookies().set('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 // 30 days, adjust as needed
      });
    } else {
      console.warn('No refresh token provided by Google');
    }

    const baseUrl = process.env.NEXTAUTH_URL || `http://${request.headers.get('host')}`;
    return NextResponse.redirect(`${baseUrl}/dashboard`);
  } catch (error) {
    console.error('Error during authentication:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 400 });
  }
}