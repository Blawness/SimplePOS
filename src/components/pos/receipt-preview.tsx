import React from "react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import type { CartItem } from "@/lib/types"

interface ReceiptPreviewProps {
  items: CartItem[]
  total: number
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export const ReceiptPreview = React.forwardRef<HTMLDivElement, ReceiptPreviewProps>(
  ({ items, total }, ref) => {
    const currentDate = new Date().toLocaleString("id-ID", {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })

    return (
      <div ref={ref} className="p-4 text-sm bg-white text-black w-[280px] mx-auto">
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold">Shadcn POS</h2>
          <p>Jl. Fiktif No. 123, Jakarta</p>
          <p>{currentDate}</p>
        </div>
        <Table>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="border-b-0">
                <TableCell className="p-1">
                  <div>{item.name}</div>
                  <div className="pl-2">{item.quantity} x {formatCurrency(item.price)}</div>
                </TableCell>
                <TableCell className="p-1 text-right">
                  {formatCurrency(item.price * item.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <hr className="my-2 border-dashed border-black" />
        <div className="flex justify-between font-bold mt-2">
          <span>TOTAL</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <div className="text-center mt-6">
          <p>Terima kasih atas kunjungan Anda!</p>
        </div>
      </div>
    )
  }
)
ReceiptPreview.displayName = "ReceiptPreview"
