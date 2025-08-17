'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/utils"

interface MonthlySales {
  month: string
  sales: number
}

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  price: number
  stock: number
  categoryId: string
  category: {
    id: string
    name: string
  }
}

interface DashboardClientProps {
  monthlySales: MonthlySales[]
  categories: Category[]
  products: Product[]
}

export function DashboardClient({
  monthlySales,
  categories,
  products
}: DashboardClientProps) {
  // Calculate additional analytics
  const totalSales = monthlySales.reduce((sum, month) => sum + month.sales, 0)
  const avgMonthlySales = totalSales / monthlySales.length
  
  // Category distribution
  const categoryStats = categories.map(category => {
    const categoryProducts = products.filter(p => p.categoryId === category.id)
    const totalStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0)
    const totalValue = categoryProducts.reduce((sum, p) => sum + (p.price * p.stock), 0)
    
    return {
      name: category.name,
      productCount: categoryProducts.length,
      totalStock,
      totalValue,
      percentage: (categoryProducts.length / products.length) * 100
    }
  }).sort((a, b) => b.totalValue - a.totalValue)

  // Low stock products
  const lowStockProducts = products
    .filter(p => p.stock < 10)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 5)

  // High value products
  const highValueProducts = products
    .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
    .slice(0, 5)

  return (
    <Tabs defaultValue="analytics" className="space-y-4">
      <TabsList>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="inventory">Inventory</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
      </TabsList>

      <TabsContent value="analytics" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Sales</span>
                  <span className="font-medium">{formatCurrency(totalSales)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Average Monthly</span>
                  <span className="font-medium">{formatCurrency(avgMonthlySales)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Best Month</span>
                  <span className="font-medium">
                    {monthlySales.reduce((best, month) => 
                      month.sales > best.sales ? month : best
                    ).month}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryStats.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{category.name}</span>
                    <span className="font-medium">{category.productCount} products</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="inventory" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(product.price)} per unit
                      </p>
                    </div>
                    <Badge variant={product.stock === 0 ? "destructive" : "secondary"}>
                      {product.stock} left
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>High Value Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {highValueProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Stock: {product.stock} units
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatCurrency(product.price)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total: {formatCurrency(product.price * product.stock)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="performance" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-muted-foreground">Total Products</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {products.reduce((sum, p) => sum + p.stock, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Total Stock</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {formatCurrency(products.reduce((sum, p) => sum + (p.price * p.stock), 0))}
                </div>
                <p className="text-xs text-muted-foreground">Inventory Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
