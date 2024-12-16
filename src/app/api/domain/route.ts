import { NextResponse } from 'next/server';
import { Domain, Keyword } from '@/model/domain.Model';
import dbConnect from '@/lib/dbConnect';
import { updateKeywordStats } from './updateKeywordStats';
import {KeywordStats} from '@/model/keywordStats.Model'


export async function POST(request: Request) {
    await dbConnect();

    try {
        const { userId, domain, keywords, workDescription } = await request.json();
        
        if (!userId || !domain || !Array.isArray(keywords)) {
            return NextResponse.json({ error: 'userId, name, and keywords are required' }, { status: 400 });
        }

        // Fetch the user's order to get the numberOfKeywords limit
        const totalKeywords = await KeywordStats.findOne({ userId }).exec();

        
        if (!totalKeywords || totalKeywords === 0) {
            return NextResponse.json({ error: 'No Added Keywords found for this user.' }, { status: 404 });
        }

        const existingKeywords = await Keyword.find({ userId }).exec();
        const existingKeywordCount = existingKeywords.length;

        // Check if the number of keywords exceeds the limit
        if (existingKeywordCount + keywords.length > totalKeywords.totalKeywords) {
            return NextResponse.json({ message: `You can only have a maximum of ${totalKeywords.totalKeywords} keywords.` }, { status: 400 });
        }


        // Create a new domain entry
        const newDomain = new Domain({
            userId,
            domain,
            workDescription,
        });

        // Create keywords and associate them with the userId
        const currentDate = new Date();
        const expiryDate = new Date(currentDate.setDate(currentDate.getDate() + 30));

        // Create keywords and associate them with the userId
        const keywordDocuments = keywords.map((keyword: string) => ({
            userId,
            content: keyword,
            isExpired: false,
            expiryDate: expiryDate
        }));

        // Save the keywords to the database
        const savedKeywords = await Keyword.insertMany(keywordDocuments);
        await updateKeywordStats(userId);

        // Add the saved keywords to the domain
        newDomain.keywords = savedKeywords;

        // Save the new domain to the database
        await newDomain.save();

        // Return a success response
        return NextResponse.json({ message: 'Domain created successfully', domain: newDomain }, { status: 200 });
    } catch (error) {
        console.error('Error creating domain:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
