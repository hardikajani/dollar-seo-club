import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Domain } from '@/model/domain.Model';

export const dynamic = 'force-dynamic';

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

        // Log domains and keywords before update
        const domainsBefore = await Domain.find({ userId: userId });
        console.log('Domains and keywords before update:', domainsBefore);

        // Update expired keywords within domains
        const updateResult = await Domain.updateMany(
            { userId: userId },
            {
                $set: {
                    "keywords.$[elem].isExpired": true
                }
            },
            {
                arrayFilters: [{ "elem.expiryDate": { $lt: currentDate }, "elem.isExpired": false }],
                multi: true
            }
        );
        console.log('Update result:', updateResult);

        // Fetch updated domains and keywords
        const domainsAfter = await Domain.find({ userId: userId }).sort({ createdAt: -1 });
        console.log('Domains and keywords after update:', domainsAfter);

        if (!domainsAfter || domainsAfter.length === 0) {
            return NextResponse.json({ error: 'No domains or keywords found for this user' }, { status: 404 });
        }

        // Extract all keywords from all domains
        const allKeywords = domainsAfter.flatMap(domain => domain.keywords);

        return NextResponse.json({ keywords: allKeywords }, { status: 200 });
    } catch (error) {
        console.error('Error fetching keywords details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}