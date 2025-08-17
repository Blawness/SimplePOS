import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser, userHasPermission } from '@/lib/auth'

export async function GET () {
  const me = await getAuthenticatedUser()
  if (!me || !userHasPermission(me, 'product.read')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const products = await prisma.product.findMany({ include: { category: true } })
  return NextResponse.json(products)
}

export async function POST (req: Request) {
  const me = await getAuthenticatedUser()
  if (!me || !userHasPermission(me, 'product.create')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const body = await req.json()
  const { name, price, stock, categoryId, image } = body
  if (!name || !price || !categoryId || !image) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  const created = await prisma.product.create({
    data: { name, price, stock, categoryId, image }
  })
  const withCategory = await prisma.product.findUnique({ where: { id: created.id }, include: { category: true } })
  return NextResponse.json(withCategory, { status: 201 })
}

