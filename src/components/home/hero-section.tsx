'use client'


import React from 'react'
import KeywordsOptimise from './keywords-optimise'
import { ArrowUpRight } from 'lucide-react'

const HeroSection = () => {


    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-y-5 px-5 md:px-10 py-5 w-full rounded-3xl [background:radial-gradient(125%_125%_at_40%_40%,#F8FAFC_20%,#D1D5DB_100%)]'>
            <div className='flex flex-col'>
                <h1 className='text-2xl lg:text-[40px] lg:leading-tight font-bold tracking-wider'>Optimise One Keyword For One Dollar — No Limits, No Rules, No Minimum Contracts.</h1>
                <h2 className='text-base tracking-wider'>Simple, easy and affordable SEO Solution at your fingertips.</h2>
                <div className='flex flex-col mt-5 md:mt-10 gap-2 text-blue-500 text-[14px] '>
                    <div className='flex flex-row gap-2'>
                        <span><ArrowUpRight /></span>
                        <span>PAY FOR WHAT YOU NEED</span>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <span><ArrowUpRight /></span>
                        <span>NO ADDITIONAL FEES</span>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <span><ArrowUpRight /></span>
                        <span>NO COMMITMENTS,CANCEL ANYTIME</span>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <span><ArrowUpRight /></span>
                        <span>INCREASE KEYWORDS AS YOU NEED</span>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-y-5'>
                <KeywordsOptimise />
            </div>

        </div>
    )
}

export default HeroSection