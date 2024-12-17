import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { generateText } from '@/utils/generateText';

export const runtime = 'edge';

axiosRetry(axios, { retries: 2, retryDelay: axiosRetry.exponentialDelay });

async function fetchWebContent(url:any) {
  try {
    const response = await axios.get(url, { timeout: 10000 });
    const $ = cheerio.load(response.data);
    return $('body').text().replace(/\s+/g, ' ').trim();
  } catch (error:any) {
    console.error(`Error fetching ${url}:`, error.message);
    return null;
  }
}

async function fetchSearchResults(query:any) {
  // Replace this with an actual search engine API call
  // This is a mock implementation
  return `Search results for "${query}": 
  1. ${query} - Official Website
  2. About ${query} - Wikipedia
  3. ${query} Products and Services
  4. News about ${query}`;
}

export async function POST(req: Request) {
  const { domain, keyword } = await req.json();

  if (!domain || !keyword) {
    return new Response('Domain and keyword are required', { status: 400 });
  }

  try {
    let pageContent = await fetchWebContent(domain);
    
    if (!pageContent) {
      // console.log(`Failed to fetch content from ${domain}. Using search results instead.`);
      pageContent = await fetchSearchResults(`${domain} ${keyword}`);
    }

    if (!pageContent) {
      return new Response('Unable to fetch content or search results.', { status: 500 });
    }

    const prompt: string = `
      Analyze the following content related to the URL: "${domain}" and optimize it for the target keyword: "${keyword}".

      Content:
      "${pageContent.slice(0, 3000)}"

      1. Review the content and identify:
         - How well the current content aligns with the target keyword.
         - Areas where the keyword usage is missing or inconsistent.
         - Opportunities for improving keyword density and placement (e.g., headers, paragraphs, meta tags).

      2. Generate:
         - An SEO-friendly page title (50-60 characters) optimized for the target keyword.
         - A meta description (150-160 characters) that includes the target keyword and its variations naturally.

      3. Provide recommendations for:
         - Improving content structure (e.g., adding subheadings, bulleted lists, or summaries).
         - Adding related long-tail keywords, synonyms, and semantic variations.
         - Enhancing the overall content for better search engine ranking and user engagement.

      Format the output as follows:
      - Current Analysis: [Brief summary of the content based on the available information.]
      - Title: [Optimized Page Title]
      - Description: [Optimized Meta Description]
      - Recommendations:
         - [1st Recommendation]
        - [2nd Recommendation]
        - [etc.]
    `;

    const generatedText = await generateText(prompt);

    return NextResponse.json({ text: generatedText });
  } catch (error:any) {
    console.error('Error generating text:', error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}