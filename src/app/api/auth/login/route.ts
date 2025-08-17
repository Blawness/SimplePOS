import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { issueTokenForUserId } from '@/lib/auth'

export async function POST (req: Request) {
  try {
    const { identifier, password, rememberMe } = await req.json()
    if (!identifier || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
        status: 'ACTIVE'
      },
      include: { role: true }
    })

    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    await issueTokenForUserId(user.id, !!rememberMe)
    return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role.name })
  } catch (err) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}



