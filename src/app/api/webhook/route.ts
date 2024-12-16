import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { User } from '@/model/user.Model';

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    // Get the headers
    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occurred -- no svix headers', {
            status: 400
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occurred', {
            status: 400
        });
    }

    // Check the event type
    if (evt.type === 'user.created') {
        const { id, first_name, last_name, email_addresses } = evt.data;

        await dbConnect();

        try {
            // Prepare the user data
            const userData = {
                clerkId: id,
                firstName: first_name || null,
                lastName: last_name || null,
                email: email_addresses && email_addresses[0] ? email_addresses[0].email_address : null,
            };

            // Create a new user in the database
            const newUser  = await User.create(userData);

            return NextResponse.json({ message: 'User  created successfully', user: newUser  });
        } catch (error) {
            console.error('Error creating user:', error);
            return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
        }
    } else {
        return NextResponse.json({ message: 'Event type not handled' }, { status: 200 });
    }
}