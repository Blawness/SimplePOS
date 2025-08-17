import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main () {
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
}

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


