"use client"

import Link from 'next/link'
import ProfileIcon from '@/icons/profile'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'



const DashboardNavbar = () => {

    return (
        <>
            <SignedIn>
                <UserButton />
            </SignedIn>
            <SignedOut>
                <Link href="/sign-in">
                    <ProfileIcon />
                </Link>
            </SignedOut>
        </>
    )
}

export default DashboardNavbar;