
import Image from 'next/image'
import blacklink from '@/icons/icans/BackLink.svg'
import ranking from '@/icons/icans/Ranking.svg'
import content from '@/icons/icans/Content.svg'
import onSite from '@/icons/icans/On-Site.svg'
import aiContent from '@/icons/icans/AI-Content.svg'
import seoRecommendations from '@/icons/icans/SEO-Recommendations.svg'
import seoOpportunities from '@/icons/icans/SEO-Opportunities.svg'
import integrations from '@/icons/icans/Integrations.svg'

const included = [
  { title: 'Back Link Analysis', icon: blacklink },
  { title: 'Ranking Report', icon: ranking },
  { title: 'Content Audit', icon: content },
  { title: 'On-Site Technical', icon: onSite },
  { title: 'AI Content Generation', icon: aiContent },
  { title: 'SEO Recommendations', icon: seoRecommendations },
  { title: 'SEO Opportunities', icon: seoOpportunities },
  { title: 'Integrations', icon: integrations }
]

const WhatsIncluded = () => {
  return (
    <section className="py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-12">
          <div className="inline-block border border-blue-600 rounded-lg px-5 md:px-20 py-2 md:mb-4">
            <h2 className="text-lg md:text-2xl font-bold text-blue-600">WHAT&apos;S INCLUDED</h2>
          </div>
          <p className="text-base md:text-xl font-semibold text-gray-800">Everything you need to get ranking!</p>
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhatsIncluded;