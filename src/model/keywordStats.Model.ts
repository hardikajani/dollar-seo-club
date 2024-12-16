import mongoose, { Document, Schema } from 'mongoose';

export interface IKeywordStats extends Document {
    userId: string;
    totalOrderedKeywords: number;
    totalAddedKeywords: number;
    totalKeywords: number;
    lastUpdated: Date;
}

const KeywordStatsSchema: Schema = new Schema({
    userId: { type: String, required: true },
    totalOrderedKeywords: { type: Number, required: true, default: 0 },
    totalAddedKeywords: { type: Number, required: true, default: 0 },
    totalKeywords: { type: Number, required: true, default: 0 },
    lastUpdated: { type: Date, required: true, default: Date.now },
});

const KeywordStats = mongoose.models.KeywordStats || mongoose.model<IKeywordStats>('KeywordStats', KeywordStatsSchema);

export { KeywordStats };