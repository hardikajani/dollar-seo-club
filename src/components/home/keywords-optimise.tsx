'use client'

import { ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import getStripe from '@/lib/stripe';
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const KeywordsOptimise = () => {
    // State to hold the number of keywords
    const [keywordsCount, setKeywordsCount] = useState(1);
    const { isSignedIn, userId, isLoaded } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Check for pending checkout on component mount
        if (isSignedIn && isLoaded) {
            const pendingCheckout = localStorage.getItem('pendingCheckout');
            if (pendingCheckout) {
                const { keywords } = JSON.parse(pendingCheckout);
                setKeywordsCount(keywords);
                localStorage.removeItem('pendingCheckout');
                handleStripeCheckout(keywords);
            }
        }
    }, [isSignedIn, isLoaded]);

    const increaseKeywords = () => {
        setKeywordsCount(prevCount => prevCount + 1);
    };

    const decreaseKeywords = () => {
        setKeywordsCount(prevCount => (prevCount > 1 ? prevCount - 1 : 1));
    };

    const totalCost = keywordsCount * 1;

    const handleCheckout = async () => {
        if (!isSignedIn || !userId || !isLoaded) {
            // Store the pending checkout information
            localStorage.setItem('pendingCheckout', JSON.stringify({ keywords: keywordsCount }));
            router.push('/sign-in');
            return;
        }

        await handleStripeCheckout(keywordsCount);
    };

    const handleStripeCheckout = async (keywords:number) => {
        const stripe = await getStripe();

        try {
            const response = await axios.post('/api/checkout', { 
                amount: 1, 
                keywords: keywords,
                userId: userId  
            });

            if (response.status === 200) {
                const session = response.data;

                if (session.id) {
                    await stripe?.redirectToCheckout({ sessionId: session.id });
                } else {
                    console.error('Failed to create checkout session:', session.error);
                }
            } else {
                console.error('Failed to create checkout session:', response.data);
            }
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <>
            <div className='flex flex-col w-full gap-y-5'>
                <h3 className='text-2xl font-bold self-center'>No. of keywords to optimise</h3>
                <div className='flex flex-row gap-5 text-xl self-center'>
                    <button
                        className='w-8 bg-blue-600 rounded-full p-1 text-white text-[30px] my-auto'
                        onClick={decreaseKeywords}
                    >
                        -
                    </button>
                    <input
                        type="number"
                        value={keywordsCount}
                        onChange={(e) => setKeywordsCount(parseInt(e.target.value))}
                        className='border-2 w-20 border-blue-600 rounded-md p-2 text-center'
                        min={1}
                        style={{
                            WebkitAppearance: "none",
                            MozAppearance: "textfield",
                          }}
                    />
                    <button
                        className='w-8 bg-blue-600 rounded-full p-1 text-white text-[30px] my-auto'
                        onClick={increaseKeywords}
                    >
                        +
                    </button>
                </div>
            </div>
            <div className='flex flex-col w-full gap-y-5 justify-center items-center'>
                <h3 className='text-lg self-center'>Your Total SEO Cost Per Month</h3>
                <div className='flex flex-col gap-5 text-xl self-center'>
                    <div className='flex flex-row gap-1 border-2 border-blue-600 rounded-md p-2'>
                        <span className='text-2xl font-bold'>$</span>
                        <span className='text-2xl font-bold'>{totalCost}</span>
                    </div>
                </div>
                <button 
                    className='w-max border-4 border-blue-600 rounded-full text-center text-lg font-bold p-2'
                    onClick={handleCheckout}    
                >
                    Optimise Now <ArrowRight className='inline text-blue-600' />
                </button>
            </div>
        </>
    );
}

export default KeywordsOptimise;