import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl;
  const ua = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';

  const allowedReferers = [
    /^https?:\/\/([a-z0-9-]+\.)?pcl2\.server(\/|$)/i,
    /^https?:\/\/([a-z0-9-]+\.)?pcl2\.open\.server(\/|$)/i
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
  matcher: '/:path*'
};
