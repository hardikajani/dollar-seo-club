import { NextResponse } from 'next/server';
import axios from 'axios';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function makeRequest(keyword: string, retries = 0): Promise<any> {
    try {
        const response = await axios.post(
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
                },
                timeout: 29000 // Set a 29-second timeout (assuming a 30-second function timeout)
            }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.code === 'ECONNABORTED' && retries < MAX_RETRIES) {
            console.log(`Request timed out. Retrying (${retries + 1}/${MAX_RETRIES})...`);
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return makeRequest(keyword, retries + 1);
        }
        throw error;
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { keyword } = body;

        if (!keyword) {
            return NextResponse.json({ message: 'keyword is required' }, { status: 400 });
        }

        const summaryResponse = await makeRequest(keyword);

        const combinedResult = {
            summary: summaryResponse,
        };

        return NextResponse.json(combinedResult);
    } catch (error) {
        console.error('API call failed:', error);
        let errorMessage = 'Unknown error';
        let statusCode = 500;

        if (axios.isAxiosError(error)) {
            errorMessage = error.message;
            statusCode = error.response?.status || 500;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        return NextResponse.json(
            { status: 'error', message: errorMessage },
            { status: statusCode }
        );
    }
}