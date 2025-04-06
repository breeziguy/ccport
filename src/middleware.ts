import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  
  try {
    const supabase = createMiddlewareClient({ req: request, res });
    
    const {
      data: { session },
    } = await supabase.auth.getSession();
    
    // Check if user is authenticated for protected routes
    if (!session && request.nextUrl.pathname.startsWith('/clients/dashboard')) {
      // Redirect to login page
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/auth/login';
      return NextResponse.redirect(redirectUrl);
    }
    
    // Redirect logged in users from login page to dashboard
    if (session && request.nextUrl.pathname === '/auth/login') {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/clients/dashboard';
      return NextResponse.redirect(redirectUrl);
    }
  } catch (error) {
    console.error('Middleware error:', error);
  }
  
  return res;
}

export const config = {
  matcher: [
    '/clients/dashboard/:path*',
    '/auth/login',
    '/auth/signup',
  ],
} 