"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QrCode, Download, Printer } from "lucide-react"
import type { Meja } from "@/services/outlet/meja-service"

interface ViewQrDialogProps {
  meja: Meja | null
  onClose: () => void
}

export function ViewQrDialog({ meja, onClose }: ViewQrDialogProps) {
  if (!meja) return null

  // Generate QR Code URL from the public qrserver API using the database qr_code link as data
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(meja.qr_code || "")}`

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Cetak QR Code - ${meja.nomor_meja}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .container {
              text-align: center;
              border: 2px solid #ccc;
              padding: 40px;
              border-radius: 20px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            img {
              width: 300px;
              height: 300px;
            }
            h1 {
              margin-top: 20px;
              font-size: 28px;
              color: #333;
            }
            p {
              color: #666;
              margin-top: 10px;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="${qrImageUrl}" alt="QR Code" />
            <h1>${meja.nomor_meja}</h1>
            <p>Scan untuk memesan makanan</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(qrImageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `QR_${meja.nomor_meja.replace(/\s+/g, "_")}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Gagal mendownload QR code", error)
      // Fallback: open in new tab
      window.open(qrImageUrl, "_blank")
    }
  }

  return (
    <Dialog open={!!meja} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-[400px] overflow-hidden bg-white border-0 rounded-2xl shadow-xl p-6">
        <DialogHeader className="pb-3 border-b border-gray-100 flex flex-row items-center gap-2">
          <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <QrCode className="size-4" />
          </div>
          <DialogTitle className="text-xl font-bold text-gray-800">
            QR Code - {meja.nomor_meja}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl shadow-inner">
            <img
              src={qrImageUrl}
              alt={`QR Code ${meja.nomor_meja}`}
              className="size-56 object-contain"
            />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-gray-800">{meja.nomor_meja}</p>
            <p className="text-xs text-gray-400 break-all max-w-[280px]">
              {meja.qr_code}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleDownload}
            className="flex-1 rounded-lg h-11 border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-medium cursor-pointer flex items-center justify-center gap-2"
          >
            <Download className="size-4" /> Download
          </Button>
          <Button
            type="button"
            onClick={handlePrint}
            className="flex-1 rounded-lg h-11 bg-[#3874BC] hover:bg-[#2c5b96] text-white font-medium shadow-sm cursor-pointer flex items-center justify-center gap-2"
          >
            <Printer className="size-4" /> Cetak / Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
