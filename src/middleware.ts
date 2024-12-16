import { NextRequest } from 'next/server'
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(
  [
    '/',
    '/sign-in(.*)', 
    '/sign-up(.*)',
    '/api(.*)',
    "/api/webhook",
    "/api/auth(.*)"
  ]
)

export default clerkMiddleware(async (auth, request: NextRequest) => {
  if (!isPublicRoute(request)) await auth.protect();
    
})

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'
  ],
}