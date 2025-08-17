import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReportsPage() {
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
