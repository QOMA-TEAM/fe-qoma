"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useUpdateAvailabilityMenu, useAjukanPerubahanHarga } from "@/hooks/outlet/use-menu"
import type { OutletMenu } from "@/services/outlet/menu-outlet-service"
import { toast } from "sonner"

interface EditMenuDialogProps {
  menu: OutletMenu | null
  onClose: () => void
}

export function EditMenuDialog({ menu, onClose }: EditMenuDialogProps) {
  const [harga, setHarga] = useState<string>("")
  const [alasan, setAlasan] = useState<string>("")
  const [isAvailable, setIsAvailable] = useState<boolean>(true)

  const { mutate: updateAvailability, isPending: isUpdatingAvailability } = useUpdateAvailabilityMenu()
  const { mutate: ajukanHarga, isPending: isMengajukan } = useAjukanPerubahanHarga()

  useEffect(() => {
    if (menu) {
      setHarga(menu.harga.toString())
      setAlasan("")
      setIsAvailable(menu.is_available)
    }
  }, [menu])

  const formatRupiah = (value: string) => {
    const number = value.replace(/\D/g, "")
    if (!number) return ""
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseInt(number))
  }

  const parseRupiah = (value: string) => {
    return value.replace(/\D/g, "")
  }

  const handleHargaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseRupiah(e.target.value)
    setHarga(rawValue)
  }

  const handleSubmit = () => {
    if (!menu) return

    let closeAfter = true

    // Check if availability changed
    if (menu.is_available !== isAvailable) {
      updateAvailability({ menuId: menu.id, isAvailable })
      closeAfter = false // wait for query success to close or close now? Actually we can close, but let's just do it
    }

    // Check if harga changed
    const newHarga = parseInt(harga)
    if (!isNaN(newHarga) && newHarga !== menu.harga) {
      if (alasan.length < 10) {
        toast.error("Alasan perubahan harga harus diisi minimal 10 karakter.")
        return
      }
      ajukanHarga({ menuId: menu.id, hargaBaru: newHarga, alasan })
      closeAfter = false
    }

    if (closeAfter) {
      onClose()
    } else {
      // If we fired mutations, we'll just close it. The toast will handle notifications.
      onClose()
    }
  }

  if (!menu) return null

  const isPending = isUpdatingAvailability || isMengajukan

  return (
    <Dialog open={!!menu} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-[425px] overflow-hidden bg-white border-0 rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Edit Menu
          </DialogTitle>
        </DialogHeader>

        <div className="border-t border-gray-100 my-1" />

        <div className="space-y-5 mt-2">
          {/* Menu Name (Read Only) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Nama</label>
            <div className="h-11 w-full bg-gray-50 border-0 text-gray-700 rounded-lg shadow-sm flex items-center px-3 font-medium">
              {menu.nama}
            </div>
          </div>

          {/* Ketersediaan Switch */}
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="space-y-0.5">
              <label className="text-sm font-medium text-gray-800">Status Menu</label>
              <p className="text-xs text-gray-500">Aktifkan jika menu tersedia</p>
            </div>
            <Switch
              checked={isAvailable}
              onCheckedChange={setIsAvailable}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          {/* Harga */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Harga</label>
            <Input
              type="text"
              value={formatRupiah(harga)}
              onChange={handleHargaChange}
              className="h-11 bg-white border border-gray-200 text-gray-900 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500"
              placeholder="Rp 0"
            />
          </div>

          {/* Alasan Perubahan Harga (Only shows if harga changed) */}
          {parseInt(harga) !== menu.harga && !isNaN(parseInt(harga)) && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-sm font-medium text-gray-700">
                Alasan Pengajuan <span className="text-red-500">*</span>
              </label>
              <Textarea
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                placeholder="Tulis alasan minimal 10 karakter..."
                className="resize-none h-20 bg-white border border-gray-200 text-gray-900 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:ring-blue-500"
              />
              <p className="text-[11px] text-orange-500 font-medium">
                Perubahan harga memerlukan approval dari Owner.
              </p>
            </div>
          )}

          {/* Bahan Baku yang Digunakan (Read Only) */}
          <div className="space-y-1.5 pt-2">
            <label className="text-sm font-medium text-gray-700">Bahan Baku yang Digunakan</label>
            {menu.bahan_baku && menu.bahan_baku.length > 0 ? (
              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 max-h-32 overflow-y-auto space-y-2">
                {menu.bahan_baku.map((bahan, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1D5E84]"></div>
                      {bahan.nama}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-11 w-full bg-gray-50 border border-gray-100 text-gray-400 rounded-lg shadow-sm flex items-center px-3 text-sm italic">
                Tidak ada bahan baku yang terhubung
              </div>
            )}
            <p className="text-[11px] text-gray-500 font-medium mt-1">Bahan baku hanya bisa diubah oleh Owner.</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg px-6 h-11 bg-white hover:bg-gray-50 text-gray-700 border-gray-200 font-medium"
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-lg px-8 h-11 bg-[#1D5E84] hover:bg-[#154663] text-white font-medium shadow-sm"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
