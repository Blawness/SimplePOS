import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser, userHasPermission } from '@/lib/auth'

export async function PUT (_req: Request, { params }: { params: { id: string } }) {
  const me = await getAuthenticatedUser()
  if (!me || !userHasPermission(me, 'user.update')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const body = await _req.json()
  const { name, email, username, password, roleId, status } = body
  const data: any = { name, email, username, roleId, status }
  if (password) data.passwordHash = await bcrypt.hash(password, 10)
  const updated = await prisma.user.update({ where: { id: params.id }, data, include: { role: true } })
  return NextResponse.json(updated)
}

export async function DELETE (_req: Request, { params }: { params: { id: string } }) {
  const me = await getAuthenticatedUser()
  if (!me || !userHasPermission(me, 'user.delete')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  await prisma.user.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}



