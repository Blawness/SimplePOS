import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Package, ShoppingCart, Users, TrendingUp, TrendingDown } from "lucide-react"
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { DashboardClient } from './dashboard-client'

export default async function DashboardPage() {
  try {
    const user = await getAuthenticatedUser()
    if (!user) {
      redirect('/login')
    }

    // Fetch real data from database
    const [transactions, products, categories] = await Promise.all([
      prisma.transaction.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.findMany({
        include: { category: true }
      }),
      prisma.category.findMany()
    ])

    // Calculate real metrics
    const totalRevenue = transactions.reduce((sum, tx) => sum + tx.total, 0)
    const totalTransactions = transactions.length
    const totalProducts = products.length
    const activeCustomers = new Set(transactions.map(tx => tx.userId)).size

    // Calculate month-over-month growth
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const lastMonthRevenue = transactions
      .filter(tx => tx.createdAt >= lastMonth && tx.createdAt < thisMonth)
      .reduce((sum, tx) => sum + tx.total, 0)
    
    const thisMonthRevenue = transactions
      .filter(tx => tx.createdAt >= thisMonth)
      .reduce((sum, tx) => sum + tx.total, 0)
    
    const revenueGrowth = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0

    // Recent transactions for quick view
    const recentTransactions = transactions.slice(0, 5)

    // Low stock products
    const lowStockProducts = products.filter(p => p.stock < 10).length

    // High value products (by total inventory value)
    const highValueProducts = products
      .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
      .slice(0, 3)

    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString()}</div>
              <div className="flex items-center space-x-1 text-xs">
                {revenueGrowth >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}% from last month
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTransactions}</div>
              <p className="text-xs text-muted-foreground">
                All time transactions
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products in Stock</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Total products available
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCustomers}</div>
              <p className="text-xs text-muted-foreground">
                Unique customers
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Transaction #{transaction.id.slice(0, 8)}...
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        Rp {transaction.total.toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No transactions yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Low Stock Products</span>
                  <span className="text-sm font-medium text-red-600">{lowStockProducts}</span>
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-medium">High Value Products</p>
                  {highValueProducts.length > 0 ? (
                    highValueProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between text-xs">
                        <span className="truncate max-w-[120px]">{product.name}</span>
                        <span className="font-medium">
                          Rp {(product.price * product.stock).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No products available</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Client Component for additional analytics */}
        <DashboardClient 
          monthlySales={[]}
          categories={categories}
          products={products}
        />
      </div>
    )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Error loading dashboard data. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }
}
