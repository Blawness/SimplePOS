import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST (req: Request) {
  const { identifier } = await req.json()
  if (!identifier) return NextResponse.json({ error: 'Missing identifier' }, { status: 400 })
  const user = await prisma.user.findFirst({ where: { OR: [{ email: identifier }, { username: identifier }] } })
  if (!user) return NextResponse.json({ ok: true })
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30)
  await prisma.passwordResetToken.create({ data: { token, userId: user.id, expiresAt } })
  // In production, send email with reset link containing token
  return NextResponse.json({ ok: true, token })
}



