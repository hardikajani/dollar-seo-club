import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { domain, keyword, taskId } = body;

        if (!domain || !keyword || !taskId) {
            return NextResponse.json({ message: 'Domain, keyword and taskId is required' }, { status: 400 });
        }


        // Define the API requests


        const onPageRequest = await axios.post(
            'https://api.dataforseo.com/v3/on_page/pages',
            [{
                "id": taskId,
                "order_by": ["meta.content.plain_text_word_count,desc"],
                "limit": 10
            }],
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(process.env.DATAFORSEO_API_KEY!).toString('base64')}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const keywordsForSiteRequest = await axios.post(
            'https://api.dataforseo.com/v3/dataforseo_labs/google/keywords_for_site/live',
            [{
                "target": domain,
                "location_code": 2840,
                "language_code": "en",
                "include_serp_info": true,
                "include_subdomains": true,
                "order_by": ["keyword_info.search_volume,desc"],
                "limit": 3
            }],
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(process.env.DATAFORSEO_API_KEY!).toString('base64')}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const keywordssuggestionsRequest = await axios.post(
            'https://api.dataforseo.com/v3/dataforseo_labs/keyword_suggestions/live',
            [{
                "keyword": keyword,
                "location_code": 2840,
                "language_name": "English",
                "include_serp_info": true,
                "include_seed_keyword": true,
                "limit": 1
            }],
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(process.env.DATAFORSEO_API_KEY!).toString('base64')}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const rankedKeywordsRequest = await axios.post(
            'https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live',
            [{
                "target": domain,
                "language_name": "English",
                "location_code": 2840,
                "limit": 3
            }],
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(process.env.DATAFORSEO_API_KEY!).toString('base64')}`,
                    'Content-Type': 'application/json'
                }
            }
        );



        const backlinksSummaryRequest = await axios.post(
            'https://api.dataforseo.com/v3/backlinks/summary/live',
            [
                {
                    "target": domain,
                    "internal_list_limit": 10,
                    "include_subdomains": true,
                    "backlinks_filters": ["dofollow", "=", true],
                    "backlinks_status_type": "all"
                }
            ],
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(process.env.DATAFORSEO_API_KEY!).toString('base64')}`,
                    'Content-Type': 'application/json'
                }
            }
        );



        // Execute all requests concurrently
        const [onPageResponse, keywordsForSiteResponse, keywordssuggestionsResponse,rankedKeywordsResponse, backlinksSummaryResponse] = await Promise.all([
            onPageRequest,
            keywordsForSiteRequest,
            keywordssuggestionsRequest,
            rankedKeywordsRequest,
            backlinksSummaryRequest,

        ]);

        // Combine results
        const combinedResult = {
            onPage: onPageResponse.data,
            keywordForSite: keywordsForSiteResponse.data,
            keywordSuggestions: keywordssuggestionsResponse.data,
            rankedKeywords: rankedKeywordsResponse.data,
            backlinksSummary: backlinksSummaryResponse.data,

        };

        return NextResponse.json(combinedResult);
    } catch (error) {
        console.error('API call failed:', error);
        return NextResponse.json(
            { status: 'error', results: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}