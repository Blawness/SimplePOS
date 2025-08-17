import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from 'next/navigation'
import { getAuthenticatedUser, userHasPermission } from '@/lib/auth'

export default async function ReportsPage() {
  const user = await getAuthenticatedUser()
  if (!user || !userHasPermission(user, 'report.read')) redirect('/dashboard')
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">Reports</h2>
      <Card>
        <CardHeader>
          <CardTitle>Laporan Penjualan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Halaman laporan sedang dalam pengembangan. Fitur analitik dan visualisasi data penjualan akan tersedia di sini.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
