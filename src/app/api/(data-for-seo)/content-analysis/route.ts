import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { keyword } = body;

        if (!keyword) {
            return NextResponse.json({ message: 'keyword is required' }, { status: 400 });
        }


        // Define the API requests
        const summaryRequest = await axios.post(
            'https://api.dataforseo.com/v3/content_analysis/summary/live',
            [
                {
                    "keyword": keyword,
                    "page_type": [
                        "ecommerce",
                        "news",
                        "blogs",
                        "message-boards",
                        "organization"
                    ],
                    "internal_list_limit": 8,
                    "positive_connotation_threshold": 0.5
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
        const [summaryResponse] = await Promise.all([
            summaryRequest,
        ]);

        // Combine results
        const combinedResult = {
            summary: summaryResponse.data,
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