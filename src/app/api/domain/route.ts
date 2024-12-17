import { NextResponse } from 'next/server';
import { Domain } from '@/model/domain.Model';
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

        const existingDomain = await Domain.findOne({ userId, domain }).exec();
        const existingKeywordCount = existingDomain ? existingDomain.keywords.length : 0;

        if (existingKeywordCount + keywords.length > totalKeywords.totalKeywords) {
            return NextResponse.json({ message: `You can only have a maximum of ${totalKeywords.totalKeywords} keywords.` }, { status: 400 });
        }

        const currentDate = new Date();
        const expiryDate = new Date(currentDate.setDate(currentDate.getDate() + 30));

        const keywordDocuments = keywords.map((keyword: { value: string }) => ({
            userId,
            content: keyword.value,
            isExpired: false,
            expiryDate: expiryDate
        }));

        let newDomain;
        if (existingDomain) {
            // If domain exists, add new keywords
            existingDomain.keywords.push(...keywordDocuments);
            existingDomain.workDescription = workDescription;
            newDomain = await existingDomain.save();
        } else {
            // If domain doesn't exist, create a new one
            newDomain = new Domain({
                userId,
                domain,
                keywords: keywordDocuments,
                workDescription,
                isApproved: false,
                taskId: ''

            });
            await newDomain.save();
        }

        await updateKeywordStats(userId);

        return NextResponse.json({ message: 'Domain updated successfully', domain: newDomain }, { status: 200 });
    } catch (error) {
        console.error('Error creating/updating domain:', error);
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
