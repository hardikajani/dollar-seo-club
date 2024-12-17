import { Order } from '@/model/order.Model';
import { Domain } from '@/model/domain.Model';
import { KeywordStats } from '@/model/keywordStats.Model';

export async function updateKeywordStats(userId: string) {
    // Count ordered keywords (unchanged)
    const orderedKeywordsCount = await Order.aggregate([
        {
            $match: { userId: userId }
        },
        {
            $group: {
                _id: null,
                totalOrderedKeywords: { $sum: "$numberOfKeywords" }
            }
        }
    ]);

    // Count added keywords from Domain table
    const addedKeywordsCount = await Domain.aggregate([
        {
            $match: { userId: userId }
        },
        {
            $unwind: "$keywords"
        },
        {
            $group: {
                _id: null,
                totalAddedKeywords: { $sum: 1 }
            }
        }
    ]);

    const totalOrderedKeywords = orderedKeywordsCount[0]?.totalOrderedKeywords || 0;
    const totalAddedKeywords = addedKeywordsCount[0]?.totalAddedKeywords || 0;

    await KeywordStats.findOneAndUpdate(
        { userId: userId },
        {
            totalOrderedKeywords,
            totalAddedKeywords,
            totalKeywords: totalOrderedKeywords - totalAddedKeywords,
            lastUpdated: new Date()
        },
        { upsert: true, new: true }
    );
}