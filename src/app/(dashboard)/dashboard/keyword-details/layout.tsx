'use client';

import { useState } from "react";
import Link from "next/link";
import { keywordDetailsItems } from "@/utils/constants";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="shadow-md relative">
        <div className="container mx-auto px-4 pb-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end">
            <nav className="hidden md:flex space-x-4">
              {keywordDetailsItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 lg:px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="text-gray-500 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {keywordDetailsItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-gray-600 hover:text-gray-800 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-3 lg:px-5 py-8">
        {children}
      </main>
    </div>
  );
}