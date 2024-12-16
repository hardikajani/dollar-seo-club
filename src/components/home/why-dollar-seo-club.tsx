
import Image from 'next/image'
import saveMoney from '@/icons/icans/Save-money.svg'
import saveTime from '@/icons/icans/Save-time.svg'
import easyUse from '@/icons/icans/Easy-use.svg'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const included = [
    {
        title: 'Save money',
        icon: saveMoney
    },
    {
        title: 'Save time',
        icon: saveTime
    },
    {
        title: 'Easy to use',
        icon: easyUse
    },

]

const WhyDollarSeoClub = () => {
    return (
        <section className="py-10 md:py-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="inline-block border border-blue-600 rounded-lg px-5 md:px-20 py-2 md:mb-4">
                        <h2 className="text-lg md:text-2xl font-bold text-blue-600">HOW IT WORKS</h2>
                    </div>
                    <p className="text-base md:text-xl font-semibold text-gray-800">Get traffic to your site in 3 easy steps</p>
                </div>

                <div className="flex flex-wrap gap-4 justify-center items-center text-center">
                    {included.map((item, index) => (
                        <div key={index} className="flex flex-col items-center p-4 transition-transform duration-200 hover:scale-105">
                            <div className="w-28 h-28 mb-0 relative">
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
                            <h3 className="text-sm md:text-base font-bold text-gray-800 text-center md:mt-4">{item.title}</h3>
                        </div>
                    ))}

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

export default WhyDollarSeoClub;