
import React from "react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import type { CartItem } from "@/lib/types"

interface ReceiptPreviewProps {
  items: CartItem[]
  total: number
  tax: number
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export const ReceiptPreview = React.forwardRef<HTMLDivElement, ReceiptPreviewProps>(
  ({ items, total, tax }, ref) => {
    const currentDate = new Date().toLocaleString("id-ID", {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
    const totalWithTax = total + tax

    return (
      <div ref={ref} className="p-4 text-sm bg-white text-black w-[300px] mx-auto font-mono">
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold">Shadcn POS</h2>
          <p className="text-xs">Jl. Jenderal Sudirman No. 5, Jakarta Pusat</p>
          <p className="text-xs">{currentDate}</p>
        </div>
        <Table>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="border-b-0">
                <TableCell className="p-1 align-top">
                  <div>{item.name}</div>
                  <div className="pl-2 text-xs">{item.quantity} x {formatCurrency(item.price)}</div>
                </TableCell>
                <TableCell className="p-1 text-right align-top">
                  {formatCurrency(item.price * item.quantity)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <hr className="my-2 border-dashed border-black" />
        <div className="space-y-1 text-xs">
            <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between">
            <span>Pajak (11%)</span>
            <span>{formatCurrency(tax)}</span>
            </div>
        </div>
        <hr className="my-2 border-dashed border-black" />
        <div className="flex justify-between font-bold">
          <span>TOTAL</span>
          <span>{formatCurrency(totalWithTax)}</span>
        </div>
        <div className="text-center mt-6 text-xs">
          <p>Terima kasih telah berbelanja!</p>
          <p>Simpan struk ini sebagai bukti pembayaran.</p>
        </div>
      </div>
    )
  }
)
ReceiptPreview.displayName = "ReceiptPreview"
