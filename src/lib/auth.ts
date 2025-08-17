import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

const AUTH_COOKIE = 'pos_auth'

function getSecretKey () {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not set')
  return new TextEncoder().encode(secret)
}

export async function issueTokenForUserId (userId: string, rememberMe: boolean) {
  const secretKey = getSecretKey()
  const expSeconds = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24
  const token = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expSeconds)
    .sign(secretKey)
  const cookieStore = await cookies()
  const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge
  })
}

export async function clearAuthCookie () {
  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  })
}

export async function getAuthenticatedUser () {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_COOKIE)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    if (!payload?.sub) return null
    const user = await prisma.user.findUnique({
      where: { id: payload.sub as string },
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } }
          }
        }
      }
    })
    return user
  } catch {
    return null
  }
}

export function userHasPermission (user: any, permissionName: string) {
  if (!user?.role?.permissions) return false
  return user.role.permissions.some((rp: any) => rp.permission?.name === permissionName)
}


