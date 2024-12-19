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
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  const analyticsData = google.analyticsdata('v1beta');

  try {
    const response = await analyticsData.properties.runReport({
      auth: oauth2Client,
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      requestBody: {
        dateRanges: [
          {
            startDate: '30daysAgo',
            endDate: 'yesterday',
          },
        ],
        metrics: [
          { name: 'totalUsers' },
          { name: 'newUsers' },
          { name: 'sessions' },
          { name: 'averageSessionDuration' },
          { name: 'screenPageViewsPerSession' },
          { name: 'bounceRate' },
        ],
        dimensions: [
          { name: 'date' },
          { name: 'sessionSource' },
          { name: 'sessionMedium' },
          { name: 'deviceCategory' },
        ],
        orderBys: [
          {
            dimension: { orderType: 'ALPHANUMERIC', dimensionName: 'date' },
            desc: false
          }
        ],
      },
    });

    // Process the data to make it more readable
    const processedData = response.data.rows?.map(row => ({
      date: row.dimensionValues?.[0].value,
      source: row.dimensionValues?.[1].value,
      medium: row.dimensionValues?.[2].value,
      deviceCategory: row.dimensionValues?.[3].value,
      totalUsers: parseInt(row.metricValues?.[0].value || '0'),
      newUsers: parseInt(row.metricValues?.[1].value || '0'),
      sessions: parseInt(row.metricValues?.[2].value || '0'),
      averageSessionDuration: parseFloat(row.metricValues?.[3].value || '0'),
      pageViewsPerSession: parseFloat(row.metricValues?.[4].value || '0'),
      bounceRate: parseFloat(row.metricValues?.[5].value || '0'),
    }));

    return NextResponse.json(processedData);
  } catch (error) {
    console.error('Error fetching Analytics data:', error);
    return NextResponse.json({ error: 'Error fetching Analytics data' }, { status: 400 });
  }
}