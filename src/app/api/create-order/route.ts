import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Order } from '@/model/order.Model';
import dbConnect from '@/lib/dbConnect';
import { updateKeywordStats } from '@/app/api/domain/updateKeywordStats';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY! as string);

export async function POST(request: Request) {
    const { sessionId } = await request.json();

    if (!sessionId) {
        return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    await dbConnect();

    try {
        const stripeSession = await stripe.checkout.sessions.retrieve(sessionId) as Stripe.Checkout.Session;

        const userId = stripeSession.metadata?.userId;
        const keywords = stripeSession.metadata?.keywords;

        if (!userId || typeof userId !== 'string') {
            return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
        }

        if (stripeSession.amount_total === null) {
            return NextResponse.json({ error: 'Amount total is not available' }, { status: 400 });
        }

        const orderStatus = stripeSession.status === 'complete' ? 'complete' : '';

        const orderData = {
            userId: userId,
            totalAmount: stripeSession.amount_total / 100,
            status: orderStatus,
            paymentConfirmed: true,
            numberOfKeywords: keywords,
            stripeSessionId: stripeSession.id,
            amountTotal: stripeSession.amount_total,
            currency: stripeSession.currency,
            paymentStatus: stripeSession.payment_status,
            customerEmail: stripeSession.customer_details?.email,
        };

        // Use findOneAndUpdate with upsert option
        const order = await Order.findOneAndUpdate(
            { stripeSessionId: stripeSession.id },
            orderData,
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        await updateKeywordStats(userId);

        return NextResponse.json({ message: 'Order processed successfully', order });
    } catch (error) {
        console.error('Error processing order:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}