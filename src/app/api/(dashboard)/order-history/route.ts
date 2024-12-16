import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { Order } from '@/model/order.Model';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    await dbConnect();

    try {
        const url = new URL(request.url);
        const userId = url.searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        // Use find() instead of findOne() to get all orders for the user
        const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 });

        if (!orders || orders.length === 0) {
            return NextResponse.json({ error: 'No orders found for this user' }, { status: 404 });
        }

        // Return a success response with all orders
        return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {
        console.error('Error fetching Order details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}