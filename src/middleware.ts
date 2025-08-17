import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const AUTH_COOKIE = 'pos_auth'

export async function middleware (req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/api')) return NextResponse.next()
  if (pathname.startsWith('/login')) return NextResponse.next()

  const token = req.cookies.get(AUTH_COOKIE)?.value
  if (!token) {
    const url = new URL('/login', req.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET as string)
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    const url = new URL('/login', req.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ['/dashboard/:path*']
}


