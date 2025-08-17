
import React from "react"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import type { CartItem } from "@/lib/types"

interface ReceiptPreviewProps {
  items: CartItem[]
  total: number
  tax: number
  orderName?: string
  paymentMethod?: string
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export const ReceiptPreview = React.forwardRef<HTMLDivElement, ReceiptPreviewProps>(
  ({ items, total, tax, orderName, paymentMethod }, ref) => {
    const currentDate = new Date().toLocaleString("id-ID", {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
    const totalWithTax = total + tax
    
    // Generate invoice number based on current timestamp
    const generateInvoiceNumber = () => {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      return `INV-${year}${month}${day}-${hours}${minutes}${seconds}`
    }
    
    const invoiceNumber = generateInvoiceNumber()

    return (
      <div ref={ref} className="p-4 text-sm bg-white text-black w-[300px] mx-auto font-mono">
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold">Shadcn POS</h2>
          <p className="text-xs">Jl. Jenderal Sudirman No. 5, Jakarta Pusat</p>
          <p className="text-xs">{currentDate}</p>
          <div className="mt-2 space-y-1">
            <p className="text-xs font-medium">No. Invoice: {invoiceNumber}</p>
            <p className="text-xs font-medium">
              Order: {orderName || 'N/A'}
            </p>
          </div>
        </div>
        <hr className="my-2 border-dashed border-black" />
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
        <hr className="my-2 border-dashed border-black" />
        <div className="text-center mb-2">
          <p className="text-xs font-medium">
            Metode Pembayaran: {
              paymentMethod === 'tunai' ? '💵 TUNAI' :
              paymentMethod === 'qris' ? '📱 QRIS' :
              paymentMethod === 'debit' ? '💳 DEBIT' :
              paymentMethod ? paymentMethod.toUpperCase() : 'N/A'
            }
          </p>
        </div>
        <div className="text-center mt-4 text-xs">
          <p>Terima kasih telah berbelanja!</p>
          <p>Simpan struk ini sebagai bukti pembayaran.</p>
          <div className="mt-2 p-2 bg-gray-100 rounded">
            <p className="font-medium">No. Invoice: {invoiceNumber}</p>
          </div>
        </div>
      </div>
    )
  }
)
ReceiptPreview.displayName = "ReceiptPreview"
