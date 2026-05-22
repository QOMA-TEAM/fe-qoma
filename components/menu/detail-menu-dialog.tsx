"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { MenuMaster } from "@/types/menu"

interface DetailMenuDialogProps {
  menu: MenuMaster | null
  onClose: () => void
}

export function DetailMenuDialog({ menu, onClose }: DetailMenuDialogProps) {
  if (!menu) return null

  return (
    <Dialog open={!!menu} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">Detail Menu</DialogTitle>
        </DialogHeader>

        <div className="border-t border-gray-200 my-1" />

        <div className="space-y-4 mt-2">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{menu.nama}</h3>
            <span className="text-sm text-gray-500">{menu.kategori?.nama || '-'}</span>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-2">Informasi Menu</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Harga</span>
                  <span className="text-gray-800 font-medium">Rp {Number(menu.harga_default).toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Jumlah Bahan Baku</span>
                  <span className="text-gray-800 font-medium">{menu.bahan_masters?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Kategori</span>
                  <span className="text-gray-800 font-medium">{menu.kategori?.nama || '-'}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-700 mb-2">Bahan Baku</h4>
              <div className="space-y-1.5 text-sm max-h-[180px] overflow-y-auto">
                {menu.bahan_masters?.map((b) => (
                  <div key={b.id} className="flex justify-between">
                    <span className="text-gray-500">{b.nama}</span>
                    <span className="text-gray-800 font-medium">{b.pivot.jumlah_pakai} {b.satuan}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <Button onClick={onClose} className="rounded-full px-10 bg-blue-600 hover:bg-blue-700 text-white">
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
