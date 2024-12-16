import mongoose, { Document, Schema } from 'mongoose';

// Define IPopularityData interface
export interface IPopularityData {
    date: Date;          
    popularity: number;  
    location?: string;   
    gender?: string;     
}

// Keyword Schema
export interface IKeyword extends Document {
    userId: mongoose.Types.ObjectId;  
    name: string;
    popularityData: IPopularityData[];
    createdAt: Date;
    updatedAt: Date;
}

const KeywordSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User ', required: true },
    name: { type: String, required: true },
    popularityData: [
        {
            date: { type: Date, required: true },
            popularity: { type: Number, required: true },
            location: { type: String },
            gender: { type: String },
        },
    ],
}, {
    timestamps: true,
});

export interface IDomain extends Document {
    userId: mongoose.Types.ObjectId; // Reference to the user
    name: string; // The domain name (e.g., example.com)
    keywords: mongoose.Types.ObjectId[]; // Array of keyword IDs
    createdAt: Date;
    updatedAt: Date;
}

// Domain Schema
const DomainSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User ', required: true },
    name: { type: String, required: true }, // Domain name
    keywords: [{ type: Schema.Types.ObjectId, ref: 'Keyword' }], // Array of keyword IDs
}, {
    timestamps: true,
});

// Order Schema
export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId; // Reference to the user
    keywords: IKeyword[];
    totalAmount: number;
    status: 'pending' | 'completed' | 'failed';
    paymentMethodId?: string; // Stripe payment method ID
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User ', required: true },
    keywords: [{ type: Schema.Types.ObjectId, ref: 'Keyword' }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentMethodId: { type: String }, // Optional
}, {
    timestamps: true,
});

// Subscription Schema
export interface ISubscription extends Document {
    userId: mongoose.Types.ObjectId; // Reference to the user
    stripeSubscriptionId: string; // Stripe subscription ID
    status: 'active' | 'canceled' | 'past_due';
    createdAt: Date;
    updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User ', required: true },
    stripeSubscriptionId: { type: String, required: true },
    status: { type: String, enum: ['active', 'canceled', 'past_due'], default: 'active' },
}, {
    timestamps: true,
});

// Admin Review Schema
export interface IAdminReview extends Document {
    userId: mongoose.Types.ObjectId; // Reference to the user
    keywords: IKeyword[];
    status: 'approved' | 'rejected' | 'pending';
    comments?: string; // Optional comments from the admin
    createdAt: Date;
    updatedAt: Date;
}

const AdminReviewSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref : 'User  ', required: true },
    keywords: [{ type: Schema.Types.ObjectId, ref: 'Keyword' }],
    status: { type: String, enum: ['approved', 'rejected', 'pending'], default: 'pending' },
    comments: { type: String },
}, {
    timestamps: true,
});


const Keyword = (mongoose.models.Keyword as mongoose.Model<IKeyword>)|| mongoose.model<IKeyword>('Keyword', KeywordSchema);
const Domain = (mongoose.models.Domain as mongoose.Model<IDomain>) || mongoose.model<IDomain>('Domain', DomainSchema);
const Order = (mongoose.models.Order as mongoose.Model<IOrder>)|| mongoose.model<IOrder>('Order', OrderSchema);
const Subscription = (mongoose.models.Subscription as mongoose.Model<ISubscription>)|| mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
const AdminReview = (mongoose.models.AdminReview as mongoose.Model<IAdminReview>)|| mongoose.model<IAdminReview>('AdminReview', AdminReviewSchema);

export { Keyword, Domain, Order, Subscription, AdminReview };