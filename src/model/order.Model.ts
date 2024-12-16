import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
    userId: string; 
    totalAmount: number;
    status: string;
    paymentConfirmed: boolean; 
    numberOfKeywords: number; 
    stripeSessionId: string;
    currency: string;
    paymentStatus: string;
    customerEmail?: string;
    createdAt: Date; 
    updatedAt: Date; 
}

const OrderSchema: Schema = new Schema({
    userId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, required: true, default: 'pending' },
    paymentConfirmed: { type: Boolean, default: false }, 
    numberOfKeywords: { type: Number, required: true, default: 0 },
    stripeSessionId: { type: String, required: true, unique: true, index: true }, 
    currency: { type: String, required: true }, 
    paymentStatus: { type: String, required: true },
    customerEmail: { type: String },
}, {
    timestamps: true,
});

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export { Order };