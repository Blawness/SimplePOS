import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser, userHasPermission } from '@/lib/auth'

export async function GET () {
  const me = await getAuthenticatedUser()
  if (!me || !userHasPermission(me, 'user.read')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const users = await prisma.user.findMany({ include: { role: true } })
  return NextResponse.json(users)
}

export async function POST (req: Request) {
  const me = await getAuthenticatedUser()
  if (!me || !userHasPermission(me, 'user.create')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const body = await req.json()
  const { name, email, username, password, roleId, status } = body
  if (!name || !email || !username || !password || !roleId) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  const passwordHash = await bcrypt.hash(password, 10)
  const created = await prisma.user.create({
    data: { name, email, username, passwordHash, roleId, status: status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE' },
    include: { role: true }
  })
  return NextResponse.json(created, { status: 201 })
}



