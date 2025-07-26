import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl;
  const ua = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || request.headers.get('referrer') || '';
  
  const allowedReferers = [
    /^https?:\/\/([a-zA-Z0-9-]+\.)?pcl2\.server(\/|$)/,
    /^https?:\/\/([a-zA-Z0-9-]+\.)?pcl2\.open\.server(\/|$)/
  ];

  const isUAAllowed = ua.includes('PCL2/');
  const isRefererAllowed = allowedReferers.some(regex => regex.test(referer));
  
  if (!isUAAllowed || !isRefererAllowed) {
    return new Response('Access Denied', { 
      status: 403,
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)'
  ]
};
