"use client"

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';
import Link from 'next/link'
import Logo from '@/icons/logo'
import { menuItems } from '@/utils/constants'

const Footer = () => {
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false)
  
  

  useEffect(() => {
    if (user?.publicMetadata?.role === 'admin') {
      setIsAdmin(true)
    }
  }, [user])
  if (!isLoaded) return null;


  return (
    <footer className={`relative overflow-hidden [background:radial-gradient(125%_125%_at_40%_40%,#F8FAFC_20%,#D1D5DB_100%)] ${isAdmin ? 'pt-0': 'pt-10'} pb-2 px-4 sm:px-6 lg:px-8`}>
      {/* <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:30px_30px]"></div> */}
      <div className="relative max-w-7xl mx-auto text-neutral-900">
        <div className={`flex flex-row items-center justify-start gap-x-16 md:gap-x-10 ${isAdmin ? 'hidden': null}`}>
          <div className="w-20 md:w-32 flex-shrink-0">
            <Logo />
          </div>
          {isAdmin && <Link
            href="/admin/dashboard"
            className="text-sm md:text-base hover:text-gray-900 transition-colors duration-200 ease-in-out"
          >
            Admin Dashboard
          </Link>}
          <nav className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-8">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-sm md:text-base hover:text-gray-900 transition-colors duration-200 ease-in-out"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="pt-4 text-center text-xs md:text-base">
          © {new Date().getFullYear()} DOLLAR SEO CLUB. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer