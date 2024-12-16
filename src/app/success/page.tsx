"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Logo from '@/icons/logo';

const SuccessPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const sessionId = searchParams.get('session_id');

        if (sessionId && !isProcessing) {
            const createOrder = async () => {
                setIsProcessing(true);
                try {
                    const response = await axios.post('/api/create-order', { sessionId });
                    if (response.data.message === 'Order processed successfully') {
                        router.replace('/domain');
                    } else {
                        setError('Unexpected response from server');
                    }
                } catch (error) {
                    console.error('Error creating order:', error);
                    setError('Error processing order. Please contact support.');
                } finally {
                    setIsProcessing(false);
                }
            };

            createOrder();
        }
    }, [searchParams, router, isProcessing]);

    if (error) {
        return (
            <div className='flex flex-col h-screen gap-5 justify-center items-center'>
                <Logo />
                <h1 className='text-2xl text-red-500'>Error</h1>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className='flex flex-col h-screen gap-5 justify-center items-center'>
            <Logo />
            <h1 className='text-2xl'>
                {isProcessing ? 'Processing Payment...' : 'Payment Successful!'}
            </h1>
            <p>
                {isProcessing 
                    ? 'Please wait while we process your order.'
                    : 'Your payment was successful. Thank you for your order!'
                }
            </p>
        </div>
    );
};

export default SuccessPage;