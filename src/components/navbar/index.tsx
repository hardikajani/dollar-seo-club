"use client"

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs';
import Link from 'next/link'
import ProfileIcon from '@/icons/profile'
import { AlignJustify, X } from 'lucide-react'
import Logo from '@/icons/logo'
import { menuItems } from '@/utils/constants'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'



const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false)
  
  

  useEffect(() => {
    if (user?.publicMetadata?.role === 'admin') {
      setIsAdmin(true)
    }
  }, [user])
  
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  
  if (!isLoaded) return null;
  return (
    <div className="flex gap-5 px-5 md:px-10 py-5 w-full justify-between items-center max-md:flex-wrap">
      <div className="flex gap-1.5 justify-center self-stretch my-auto text-2xl text-neutral-700">
        <button onClick={toggleMenu}>
          {isMenuOpen ? (
            <X className='w-10 h-10 cursor-pointer' />
          ) : (
            <AlignJustify className='w-10 h-10 cursor-pointer' />
          )}
        </button>

        {isMenuOpen && (
          <div className={`absolute [background:radial-gradient(125%_125%_at_40%_40%,#fff_20%,#D1D5DB_100%)]  top-16 left-0 w-80 shadow-md rounded-md ml-10 mt-10 p-4 z-50 transition-transform duration-300 ease-in-out transform ${isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-5 opacity-0"}`}>

            <div className="flex flex-col gap-5 justify-center items-center px-20 py-5 leading-[154.5%] max-md:flex-wrap max-md:px-5">

              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-2xl text-neutral-800"
                  onClick={toggleMenu}
                >
                  {item.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="text-2xl text-neutral-800"
                  onClick={toggleMenu}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
      <div className='w-20'>
        <Logo />
      </div>
      <div className='w-12 h-12'>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in">
            <ProfileIcon />
          </Link>
        </SignedOut>
      </div>



      
    </div>
  )
}

export default Navbar;