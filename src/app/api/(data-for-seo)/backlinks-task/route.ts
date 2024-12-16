import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { domain } = body;

        if (!domain) {
            return NextResponse.json({ message: 'Domain is required' }, { status: 400 });
        }


        // Define the API requests
        const summaryRequest = await axios.post(
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

        const anchorsRequest = await axios.post(
            'https://api.dataforseo.com/v3/backlinks/anchors/live',
            [
                {
                    "target": domain,
                    "limit": 4,
                    "order_by": ["backlinks,desc"],
                    "filters": ["anchor", "like", "%news%"]
                }
            ],
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(process.env.DATAFORSEO_API_KEY!).toString('base64')}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const backlinksRequest = await axios.post(
            'https://api.dataforseo.com/v3/backlinks/backlinks/live',
            [
                {
                    "target": domain,
                    "mode": "as_is",
                    "filters": ["dofollow", "=", true],
                    "limit": 5
                }
            ],
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(process.env.DATAFORSEO_API_KEY!).toString('base64')}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const referringDomainsRequest = await axios.post(
            'https://api.dataforseo.com/v3/backlinks/referring_domains/live',
            [
                {
                    "target": domain,
                    "limit": 5,
                    "order_by": ["rank,desc"],
                    "exclude_internal_backlinks": true,
                    "backlinks_filters": ["dofollow", "=", true],
                    "filters": ["backlinks", ">", 100]
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
        const [summaryResponse, anchorsResponse, backlinksResponse, referringDomainsResponse] = await Promise.all([
            summaryRequest,
            anchorsRequest,
            backlinksRequest,
            referringDomainsRequest
        ]);

        // Combine results
        const combinedResult = {
            summary: summaryResponse.data,
            anchors: anchorsResponse.data,
            backlinks: backlinksResponse.data,
            referringDomains: referringDomainsResponse.data
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