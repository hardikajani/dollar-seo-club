import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { KeywordStats } from '@/model/keywordStats.Model';

export async function GET(request: Request) {
    await dbConnect();

    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');
        
        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }
        const keywordStats = await KeywordStats.findOne({ userId: userId });
        if (!keywordStats) {
            return NextResponse.json({ error: 'KeywordStats not found' }, { status: 404 });
        }        

        // Return a success response
        return NextResponse.json({ keywordStats }, { status: 200 });
    } catch (error) {
        console.error('Error fetching keyword stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}