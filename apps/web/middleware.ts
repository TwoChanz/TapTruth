import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

/**
 * Marketing routes and shareable scrolls are public.
 * /admin (Week 7) is protected.
 *
 * Using an explicit redirect rather than `auth.protect()` because
 * the latter silently no-ops in Clerk v6 when no Clerk sign-in route
 * is configured. Once a sign-in surface lands (Week 7), we can swap
 * back to `auth.protect()` or redirect to the real sign-in URL.
 */
const isProtectedRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      // No sign-in surface yet — bounce to home with a query marker.
      const home = new URL('/', req.url);
      home.searchParams.set('signin_required', '1');
      return NextResponse.redirect(home);
    }
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
