import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY! as string);

export async function POST(request: Request) {
    const { amount, keywords, userId } = await request.json(); // Include userId in the request

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'SEO Keyword Optimization',
                        },
                        unit_amount: amount * 100, // Convert to cents 
                    },
                    quantity: keywords,
                },
            ],
            mode: 'payment',
            success_url: `${request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`, // Redirect after payment success
            cancel_url: `${request.headers.get('origin')}/`, // Redirect after payment cancel
            metadata: {
                userId: userId, // Pass userId in metadata
                keywords: keywords, // Pass keywords in metadata
            },
        });

        return NextResponse.json({ id: session.id });
    } catch (error) {
        console.error('Error creating Stripe session:', error); // Log the error for debugging
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}