import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Keyword } from '@/model/domain.Model';

export async function GET(request: Request) {
    await dbConnect();

    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        const currentDate = new Date();
        console.log('Current date:', currentDate);

        // Log keywords before update
        const keywordsBefore = await Keyword.find({ userId: userId });
        console.log('Keywords before update:', keywordsBefore);

        const updateResult = await Keyword.updateMany(
            { 
                userId: userId,
                expiryDate: { $lt: currentDate },
                isExpired: false
            },
            { $set: { isExpired: true } }
        );
        console.log('Update result:', updateResult);

        // Log keywords after update
        const keywordsAfter = await Keyword.find({ userId: userId }).sort({ createdAt: -1 });
        console.log('Keywords after update:', keywordsAfter);

        if (!keywordsAfter || keywordsAfter.length === 0) {
            return NextResponse.json({ error: 'No keywords found for this user' }, { status: 404 });
        }

        return NextResponse.json({ keywords: keywordsAfter }, { status: 200 });
    } catch (error) {
        console.error('Error fetching keywords details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}