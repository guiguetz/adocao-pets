import { auth } from '@/server/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnAdmin = req.nextUrl.pathname.startsWith('/admin');
  const isOnAuth = req.nextUrl.pathname.startsWith('/auth');

  if (isOnAdmin && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/login', req.nextUrl));
  }

  if (isOnAuth && isLoggedIn) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
