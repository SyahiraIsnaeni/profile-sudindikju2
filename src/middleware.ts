import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes yang perlu auth
const protectedRoutes = ['/dashboard'];

// Routes publik (tidak perlu auth)
const publicRoutes = ['/login', '/'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Cek apakah route ini protected
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isPublicRoute = publicRoutes.some(route => route === pathname);

  // Cek cookies atau header untuk session/token
  const hasAuth = request.cookies.get('auth-token')?.value;

  // Jika protected route & tidak ada auth, redirect ke login
  if (isProtectedRoute && !hasAuth) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika sudah login & akses login page, redirect ke dashboard
  if (pathname === '/login' && hasAuth) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg).*)',
  ],
};