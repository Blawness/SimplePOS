import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser, userHasPermission } from '@/lib/auth'

export async function GET () {
  const me = await getAuthenticatedUser()
  if (!me || !userHasPermission(me, 'transaction.read')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const txs = await prisma.transaction.findMany({
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(txs)
}

export async function POST (req: Request) {
  const me = await getAuthenticatedUser()
  if (!me || !userHasPermission(me, 'transaction.create')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const body = await req.json()
  const { total } = body
  if (typeof total !== 'number' || total <= 0) {
    return NextResponse.json({ error: 'Invalid total' }, { status: 400 })
  }
  const created = await prisma.transaction.create({ data: { total, userId: me.id } })
  return NextResponse.json(created, { status: 201 })
}



