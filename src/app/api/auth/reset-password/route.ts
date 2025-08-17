import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST (req: Request) {
  const { token, newPassword } = await req.json()
  if (!token || !newPassword) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  const record = await prisma.passwordResetToken.findUnique({ where: { token } })
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
  }
  const passwordHash = await bcrypt.hash(newPassword, 10)
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { token }, data: { usedAt: new Date() } })
  ])
  return NextResponse.json({ ok: true })
}



