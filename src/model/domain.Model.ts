import mongoose, { Document, Schema } from 'mongoose';

export interface IKeyword extends Document {
    userId: string;  
    content: string;
    isExpired: boolean;
    expiryDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const keywordSchema: Schema<IKeyword> = new Schema({
    userId: { type: String, required: true },
    content: { type: String, required: true, },
    isExpired: { type: Boolean, default: false },
    expiryDate: { type: Date, required: true },
}, {
    timestamps: true,
});

export interface IDomain extends Document {
    userId: string;
    domain: string; // The domain name (e.g., example.com)
    keywords: IKeyword[]; // Array of keyword IDs
    workDescription: string;
    taskId: string;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Domain Schema
const domainSchema: Schema<IDomain> = new Schema({
    userId: { type: String, required: true },
    domain: { type: String, required: true, unique: true }, // Domain name
    keywords: [keywordSchema], // Array of keyword IDs
    workDescription: { type: String },
    taskId: { type: String, },
    isApproved: { type: Boolean, default: false }, // Approval status
}, {
    timestamps: true,
});

// Ensure mongoose models are defined only once
const Domain = mongoose.models.Domain || mongoose.model<IDomain>("Domain", domainSchema);

export { Domain };