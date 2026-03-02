import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import path from 'path'

// Resolve path DB ke absolut supaya SQLite bisa buka file (Windows + npx prisma db seed / Git Bash)
function resolveDatabaseUrl(): void {
  let url = (process.env.DATABASE_URL || '').trim().replace(/^["']|["']$/g, '')
  if (!url) url = 'file:./prisma/dev.db'
  const match = url.match(/^file:(?:\.\/)?(.*)$/)
  if (!match) return
  const relativePath = match[1] || 'prisma/dev.db'
  let absolutePath = path.resolve(process.cwd(), relativePath)
  let normalized = absolutePath.replace(/\\/g, '/')
  // Git Bash / MINGW: /c/Users/... -> C:/Users/... agar SQLite bisa buka
  if (process.platform === 'win32' && normalized.startsWith('/') && /^\/[a-zA-Z]\//.test(normalized)) {
    normalized = normalized[1].toUpperCase() + ':' + normalized.slice(2)
  }
  process.env.DATABASE_URL = `file:${normalized}`
}

resolveDatabaseUrl()
const prisma = new PrismaClient()

async function main () {
  console.log('Seeding database...')
  // Roles
  const roles = ['Admin', 'Kasir', 'Manajer', 'Staff Gudang']
  const roleRecords = await Promise.all(
    roles.map(name => prisma.role.upsert({ where: { name }, update: {}, create: { name } }))
  )
  console.log('Roles:', roleRecords.map(r => r.name).join(', '))
  const roleByName = Object.fromEntries(roleRecords.map(r => [r.name, r]))

  // Permissions
  const permissions = [
    'user.read', 'user.create', 'user.update', 'user.delete',
    'transaction.read', 'transaction.create',
    'product.read', 'product.create', 'product.update', 'product.delete',
    'report.read'
  ]
  const permRecords = await Promise.all(
    permissions.map(name => prisma.permission.upsert({ where: { name }, update: {}, create: { name } }))
  )
  const permByName = Object.fromEntries(permRecords.map(p => [p.name, p]))

  // Assign permissions
  const assign = async (roleName: string, permNames: string[]) => {
    const role = roleByName[roleName]
    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } })
    await prisma.rolePermission.createMany({
      data: permNames.map(name => ({ roleId: role.id, permissionId: permByName[name].id }))
    })
  }
  await assign('Admin', permissions)
  await assign('Kasir', ['transaction.create', 'transaction.read', 'product.read'])
  await assign('Manajer', ['report.read', 'transaction.read', 'product.read'])
  await assign('Staff Gudang', ['product.read', 'product.update'])

  // Admin user
  const adminPasswordHash = await bcrypt.hash('password', 10)
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      name: 'Admin',
      username: 'admin',
      passwordHash: adminPasswordHash,
      roleId: roleByName['Admin'].id,
      status: 'ACTIVE'
    },
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      username: 'admin',
      passwordHash: adminPasswordHash,
      roleId: roleByName['Admin'].id,
      status: 'ACTIVE'
    }
  })
  // Upsert categories by unique name
  const categoryNames = ['Drinks', 'Snacks', 'Main Course', 'Desserts']
  await Promise.all(
    categoryNames.map(name =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name }
      })
    )
  )

  const allCategories = await prisma.category.findMany()
  const byName = Object.fromEntries(allCategories.map(c => [c.name, c]))

  // Reset products to avoid duplicates on reseed
  await prisma.product.deleteMany()

  await prisma.product.createMany({
    data: [
      { name: 'Espresso', price: 25000, stock: 100, image: 'https://placehold.co/300x300.png', categoryId: byName['Drinks'].id },
      { name: 'Caramel Macchiato', price: 45000, stock: 50, image: 'https://placehold.co/300x300.png', categoryId: byName['Drinks'].id },
      { name: 'Iced Tea', price: 20000, stock: 120, image: 'https://placehold.co/300x300.png', categoryId: byName['Drinks'].id },
      { name: 'French Fries', price: 30000, stock: 80, image: 'https://placehold.co/300x300.png', categoryId: byName['Snacks'].id },
      { name: 'Onion Rings', price: 35000, stock: 70, image: 'https://placehold.co/300x300.png', categoryId: byName['Snacks'].id },
      { name: 'Nasi Goreng', price: 55000, stock: 40, image: 'https://placehold.co/300x300.png', categoryId: byName['Main Course'].id },
      { name: 'Spaghetti Carbonara', price: 75000, stock: 30, image: 'https://placehold.co/300x300.png', categoryId: byName['Main Course'].id },
      { name: 'Chicken Steak', price: 95000, stock: 25, image: 'https://placehold.co/300x300.png', categoryId: byName['Main Course'].id },
      { name: 'Cheesecake', price: 50000, stock: 35, image: 'https://placehold.co/300x300.png', categoryId: byName['Desserts'].id },
      { name: 'Chocolate Lava', price: 48000, stock: 45, image: 'https://placehold.co/300x300.png', categoryId: byName['Desserts'].id },
      { name: 'Mineral Water', price: 10000, stock: 200, image: 'https://placehold.co/300x300.png', categoryId: byName['Drinks'].id },
      { name: 'Chicken Wings', price: 60000, stock: 60, image: 'https://placehold.co/300x300.png', categoryId: byName['Snacks'].id }
    ]
  })
  console.log('Products created:', 12)
}


main()
  .then(() => {
    console.log('Seed complete')
  })
  .catch(err => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



