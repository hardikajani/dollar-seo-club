import type { Metadata } from "next";
import localFont from "next/font/local";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "900",
});

export const metadata: Metadata = {
  title: "DOLLAR SEO CLUB",
  description: "Optimise One Keyword For One Dollar — No Limits, No Rules, No Minimum Contracts Simple, easy and affordable SEO Solution at your fingertips.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
        </head>
        <body
          className={`${geistSans.variable}`}
        >
          <div className="container flex flex-col self-center bg-slate-50 px-5 gap-y-5 max-md:px-2 w-[calc(100%-var(--removed-body-scroll-bar-size,0px))] overflow-x-hidden ">
            {/* Radial gradient for the container to give a faded effect */}
            <Navbar />
            {children}            
            <Footer />            
          </div>

        </body>
      </html>
    </ClerkProvider>
  );
}
