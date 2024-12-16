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
        const trafficRequest = await axios.post(
            'https://api.dataforseo.com/v3/dataforseo_labs/google/bulk_traffic_estimation/live',
            [
                {
                    "targets": [
                        domain
                    ],
                    "language_name": "English",
                    "location_code": 2840,
                    "item_types": [
                        "organic",
                        "paid"
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
        const [trafficResponse] = await Promise.all([
            trafficRequest,
        ]);

        // Combine results
        const combinedResult = {
            traffic: trafficResponse.data,
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