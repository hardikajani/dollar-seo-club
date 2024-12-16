import { NextResponse } from 'next/server';
import { Domain, Keyword } from '@/model/domain.Model';
import dbConnect from '@/lib/dbConnect';
import { updateKeywordStats } from './updateKeywordStats';
import { KeywordStats } from '@/model/keywordStats.Model';

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { userId, domain, keywords, workDescription } = await request.json();

        if (!userId || !domain || !Array.isArray(keywords)) {
            return NextResponse.json({ message: 'userId, domain, and keywords are required' }, { status: 400 });
        }

        const totalKeywords = await KeywordStats.findOne({ userId }).exec();

        if (!totalKeywords || totalKeywords.totalKeywords === 0) {
            return NextResponse.json({ error: 'No Added Keywords found for this user.' }, { status: 404 });
        }

        const existingKeywords = await Keyword.find({ userId }).exec();
        const existingKeywordCount = existingKeywords.length;

        if (existingKeywordCount + keywords.length > totalKeywords.totalKeywords) {
            return NextResponse.json({ message: `You can only have a maximum of ${totalKeywords.totalKeywords} keywords.` }, { status: 400 });
        }

        const newDomain = new Domain({
            userId,
            domain,
            workDescription,
        });

        const currentDate = new Date();
        const expiryDate = new Date(currentDate.setDate(currentDate.getDate() + 30));

        // Modified to handle the new keyword structure
        const keywordDocuments = keywords.map((keyword: { value: string }) => ({
            userId,
            content: keyword.value,
            isExpired: false,
            expiryDate: expiryDate
        }));

        const savedKeywords = await Keyword.insertMany(keywordDocuments);
        await updateKeywordStats(userId);

        newDomain.keywords = savedKeywords;

        await newDomain.save();

        return NextResponse.json({ message: 'Domain created successfully', domain: newDomain }, { status: 200 });
    } catch (error) {
        console.error('Error creating domain:', error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
