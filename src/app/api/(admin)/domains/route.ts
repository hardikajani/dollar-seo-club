import { NextResponse } from 'next/server';
import { Domain } from '@/model/domain.Model';
import dbConnect from '@/lib/dbConnect';

export async function GET() {
    await dbConnect();
    try {
        const domainsWithUserDetails = await Domain.aggregate([
            {
                $lookup: {
                    from: 'users', // The name of your users collection
                    localField: 'userId',
                    foreignField: 'clerkId',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    domain: 1,
                    workDescription: 1,
                    taskId: 1,
                    isApproved: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    keywords: 1,
                    user: {
                        firstName: 1,
                        lastName: 1,
                        email: 1
                    }
                }
            }
        ]);

        return NextResponse.json(domainsWithUserDetails);
    } catch (error) {
        console.error('Error fetching domains with user details:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}