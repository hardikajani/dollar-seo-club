import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { domain, keyword } = body;

        if (!domain || !keyword) {
            return NextResponse.json({ message: 'Domain and Keyword are required' }, { status: 400 });
        }


        // Define the API requests
        const rankedKeywordsRequest = await axios.post(
            'https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live',
            [
                {
                    "target": domain,
                    "language_name": "English",
                    "location_code": 2840,
                    "limit": 3
                }
            ],
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(process.env.DATAFORSEO_API_KEY!).toString('base64')}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const serpCompetitorsRequest = await axios.post(
            'https://api.dataforseo.com/v3/dataforseo_labs/google/serp_competitors/live',
            [
                {
                    "keywords": [keyword],
                    "language_name": "English",
                    "location_code": 2840,
                    "filters": [
                      ["relevant_serp_items", ">", 0],
                      "or",
                      ["median_position", "in", [1, 10]]
                    ]
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
        const [rankedKeywordsResponse, serpCompetitorsResponse] = await Promise.all([
            rankedKeywordsRequest,
            serpCompetitorsRequest,
        ]);

        // Combine results
        const combinedResult = {
            rankedKeywords: rankedKeywordsResponse.data,
            serpCompetitors: serpCompetitorsResponse.data,
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