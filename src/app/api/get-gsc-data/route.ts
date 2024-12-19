import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { cookies } from 'next/headers';

export async function GET() {
  const accessToken = cookies().get('access_token')?.value;
  const refreshToken = cookies().get('refresh_token')?.value;

  if (!accessToken || !refreshToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const searchconsole = google.webmasters('v3');

  try {
    const response = await searchconsole.searchanalytics.query({
      auth: oauth2Client,
      siteUrl: 'https://nuevainfotech.in/', // Replace with your website
      requestBody: {
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        dimensions: ['query'],
        searchType: 'web',
      },
    });

    return NextResponse.json(response.data.rows);
  } catch (error) {
    console.error('Error fetching Search Console data:', error);
    return NextResponse.json({ error: 'Error fetching Search Console data' }, { status: 400 });
  }
}