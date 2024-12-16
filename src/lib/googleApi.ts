import { google } from 'googleapis';

export async function getGoogleAuth() {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS || '{}'),
    scopes: [
      'https://www.googleapis.com/auth/webmasters.readonly',
      'https://www.googleapis.com/auth/analytics.readonly',
    ],
  });

  return auth;
}

export async function getSearchConsole() {
  const auth = await getGoogleAuth();
  return google.searchconsole({ version: 'v1', auth });
}

export async function getAnalytics() {
  const auth = await getGoogleAuth();
  return google.analytics({ version: 'v3', auth });
}