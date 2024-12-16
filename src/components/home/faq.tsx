"use client"

import { useState } from 'react'
import { CircleArrowDown } from 'lucide-react'

interface QuotationItem {
  title: string;
  description: string;
}


const quotation:QuotationItem[] = [
  {
    title: 'How much does it cost?',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.'
  },
  {
    title: 'How do you help optimise?',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.'
  },
  {
    title: 'Is there a guarantee?',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatum.'
  },
]

const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="pt-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-12">
          <div className="inline-block border border-blue-600 rounded-lg px-5 md:px-20 py-2 md:mb-4">
            <h2 className="text-lg md:text-2xl font-bold text-blue-600">FAQ</h2>
          </div>
          <p className="text-base md:text-xl font-semibold text-gray-800">Frequently Asked Questions</p>
        </div>
        
        <div className="flex justify-center">
          <div className="w-full md:w-2/3">
            <div className="flex flex-col justify-center">
              {quotation.map((item, index) => (
                <div key={index} className="border-t border-b border-blue-800">
                  <div 
                    className="flex flex-row items-center justify-between w-full p-4 cursor-pointer"
                    onClick={() => toggleFaq(index)}
                  >
                    <h3 className="text-base md:text-xl font-bold text-gray-800">{item.title}</h3>
                    <CircleArrowDown 
                      className={`w-10 h-10 transition-transform duration-300 ${openIndex === index ? 'transform rotate-180' : ''}`} 
                    />
                  </div>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="p-4 text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Faq