
import Image from 'next/image'
import choose from '@/icons/icans/Choose.svg'
import payMonthly from '@/icons/icans/Pay-monthly.svg'
import getOptimising from '@/icons/icans/Get-optimising.svg'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const included = [
    {
        title: 'Choose your keywords',
        description: 'Choose the number of keywords you want to optimise for your site.',
        icon: choose
    },
    {
        title: 'Pay monthly fee',
        description: '$1 per keyword times the number of keywords is your monthly fee.',
        icon: payMonthly
    },
    {
        title: 'Get optimising',
        description: 'Use our intuitive tool to optmise your site and watch your traffic grow!',
        icon: getOptimising
    },

]

const WhatItWorks = () => {
    return (
        <section className="md:py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-6 md:mb-12">
                    <div className="inline-block border border-blue-600 rounded-lg px-5 md:px-20 py-2 md:mb-4">
                        <h2 className="text-lg md:text-2xl font-bold text-blue-600">HOW IT WORKS</h2>
                    </div>
                    <p className="text-base md:text-xl font-semibold text-gray-800">Get traffic to your site in 3 easy steps</p>
                </div>

                <div className="flex justify-center">
                    <div className="w-full lg:w-2/3">
                        <div className="flex flex-wrap justify-center">
                            {included.map((item, index) => (
                                <div key={index} className="flex flex-col items-center w-1/2 sm:w-1/4 p-2 md:p-4 transition-transform duration-200 hover:scale-105">
                                    <div className="w-20 h-20 md:w-28 md:h-28 mb-2 relative">
                                        <Image
                                            src={item.icon}
                                            alt={item.title}
                                            layout="fill"
                                            objectFit="contain"
                                            priority
                                            quality={100}
                                            loading="eager"
                                            unoptimized
                                        />
                                    </div>
                                    <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-800 text-center">{item.title}</h3>
                                    <span className="text-sm md:text-base text-gray-600 text-center mt-2 md:mt-4">{item.description}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-center mt-8">
                    <Link
                        href='/'
                        className='w-max border-4 border-blue-600 rounded-full text-center text-lg font-bold p-2'
                    >
                        Optimise Now <ArrowRight className='inline text-blue-600' />
                    </Link>
                </div>

            </div>
        </section>
    )
}

export default WhatItWorks;