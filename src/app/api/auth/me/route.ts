import { NextResponse } from 'next/server'
import { getAuthenticatedUser } from '@/lib/auth'

export async function GET () {
  const me = await getAuthenticatedUser()
  if (!me) return NextResponse.json({ user: null })
  return NextResponse.json({
    id: me.id,
    name: me.name,
    email: me.email,
    username: me.username,
    role: me.role.name,
    permissions: me.role.permissions.map(rp => rp.permission.name)
  })
}



