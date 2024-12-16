import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json({ status: 'error', results: 'Task ID is required' }, { status: 400 });
    }

    const data = [{
      "id": taskId,
      "order_by": ["meta.content.plain_text_word_count,desc"],
      "limit": 10
    }];


    const response = await axios.post(
      'https://api.dataforseo.com/v3/on_page/pages',
      data,
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(process.env.DATAFORSEO_API_KEY!).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('API call failed:', error);
    return NextResponse.json(
      { status: 'error', results: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}