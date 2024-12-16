import Faq from "@/components/home/faq";
import GetStarted from "@/components/home/get-started";
import HeroSection from "@/components/home/hero-section";
import WhatItWorks from "@/components/home/whatItWorks";
import WhatsIncluded from "@/components/home/whatsIncluded";
import WhoIsItFor from "@/components/home/whoIsItFor";
import WhyDollarSeoClub from "@/components/home/why-dollar-seo-club";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <WhatsIncluded />
      <WhatItWorks />
      <WhyDollarSeoClub />
      <WhoIsItFor />
      <Faq />
      <GetStarted />
       
    </div>
  );
}
