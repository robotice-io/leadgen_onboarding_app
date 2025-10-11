import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/login', '/register', '/verify-email', '/forgot-password', '/reset-password', '/onboarding'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public paths and static files
  if (
    publicPaths.some(path => pathname === path || pathname.startsWith(path + '/')) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/oauth') ||
    pathname.startsWith('/dashboard') || // Let client-side layout handle dashboard auth
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // For any other protected routes, let client-side handle auth
  // (We use localStorage, not cookies, so server-side checks won't work)
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
