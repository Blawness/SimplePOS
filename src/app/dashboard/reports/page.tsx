import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from 'next/navigation'
import { getAuthenticatedUser, userHasPermission } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ReportsClient } from './reports-client'

export default async function ReportsPage() {
  const user = await getAuthenticatedUser()
  if (!user || !userHasPermission(user, 'report.read')) redirect('/dashboard')

  // Fetch data for reports
  const [transactions, products, categories] = await Promise.all([
    prisma.transaction.findMany({
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.product.findMany({
      include: { category: true }
    }),
    prisma.category.findMany()
  ])

  // Calculate analytics
  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.total, 0)
  const totalTransactions = transactions.length
  const totalProducts = products.length
  const lowStockProducts = products.filter(p => p.stock < 10).length

  // Monthly sales data for the last 6 months
  const monthlySales = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    
    const monthTransactions = transactions.filter(tx => 
      tx.createdAt >= monthStart && tx.createdAt <= monthEnd
    )
    
    monthlySales.push({
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      sales: monthTransactions.reduce((sum, tx) => sum + tx.total, 0),
      transactions: monthTransactions.length
    })
  }

  // Top selling products (by transaction count - simplified)
  const productSales = products.map(product => ({
    name: product.name,
    revenue: Math.floor(Math.random() * 1000000) + 100000, // Mock data for now
    stock: product.stock,
    category: product.category.name
  })).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

  // Category performance
  const categoryPerformance = categories.map(category => {
    const categoryProducts = products.filter(p => p.categoryId === category.id)
    const totalStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0)
    const avgPrice = categoryProducts.length > 0 
      ? categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length 
      : 0
    
    return {
      name: category.name,
      productCount: categoryProducts.length,
      totalStock,
      avgPrice: Math.round(avgPrice)
    }
  })

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">Reports & Analytics</h2>
      
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              In inventory
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">
              Products below 10 units
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Client Component */}
      <ReportsClient 
        monthlySales={monthlySales}
        productSales={productSales}
        categoryPerformance={categoryPerformance}
        transactions={transactions}
      />
    </div>
  )
}
