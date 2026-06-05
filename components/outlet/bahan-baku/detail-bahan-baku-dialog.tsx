"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { BahanOutlet } from "@/services/outlet/bahan-baku-service"

interface DetailBahanBakuDialogProps {
  bahan: BahanOutlet | null
  onClose: () => void
}

export function DetailBahanBakuDialog({ bahan, onClose }: DetailBahanBakuDialogProps) {
  if (!bahan) return null

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(angka);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-"
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date(dateStr))
  }

  // Determine primary status
  let statusBadge = (
    <Badge variant="outline" className="border-emerald-400 text-emerald-600 bg-emerald-50 rounded-full px-4">
      Aman
    </Badge>
  );

  if (bahan.is_sudah_expired) {
    statusBadge = (
      <Badge variant="outline" className="border-red-400 text-red-600 bg-red-50 rounded-full px-4">
        Kadaluarsa
      </Badge>
    );
  } else if (bahan.is_mendekati_expired) {
    statusBadge = (
      <Badge variant="outline" className="border-orange-400 text-orange-600 bg-orange-50 rounded-full px-4">
        Mendekati Kadaluarsa
      </Badge>
    );
  } else if (bahan.is_menipis) {
    statusBadge = (
      <Badge variant="outline" className="border-yellow-400 text-yellow-600 bg-yellow-50 rounded-full px-4">
        Stok Menipis
      </Badge>
    );
  }

  const hargaDefault = bahan.bahan_master.harga_default 
    ? parseFloat(bahan.bahan_master.harga_default.toString()) 
    : 0;

  return (
    <Dialog open={!!bahan} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-lg overflow-hidden bg-white border-0 rounded-2xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Detail Bahan Baku
          </DialogTitle>
        </DialogHeader>

        <div className="border-t border-gray-100 my-1" />

        {/* Top Header with Status */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <h3 className="text-lg font-bold text-gray-800 leading-tight">{bahan.bahan_master.nama}</h3>
            <p className="text-sm text-gray-500 mt-0.5">ID: {bahan.id.slice(0, 8)}</p>
          </div>
          <div className="shrink-0">
            {statusBadge}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 mt-6 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
          {/* Left: Master Information */}
          <div>
            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Info Master
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Satuan</p>
                <p className="text-gray-900 font-medium">{bahan.bahan_master.satuan}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Harga Default</p>
                <p className="text-gray-900 font-medium">{formatRupiah(hargaDefault)}</p>
              </div>
            </div>
          </div>

          {/* Right: Stok & Waktu */}
          <div>
            <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              Ketersediaan
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-0.5">Sisa Stok</p>
                  <p className="text-gray-900 font-medium text-lg">{bahan.stok}</p>
                </div>
                <div className="w-px h-8 bg-gray-200" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-0.5">Min. Stok</p>
                  <p className="text-gray-900 font-medium">{bahan.stok_minimum}</p>
                </div>
              </div>
              
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-gray-500">Tgl Masuk</span>
                  <span className="text-gray-800 font-medium text-xs text-right">{formatDate(bahan.tanggal_masuk)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Kadaluarsa</span>
                  <span className="text-gray-800 font-medium text-xs text-right">{formatDate(bahan.tanggal_kadaluarsa)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tutup Button */}
        <div className="flex justify-center mt-6 pt-2">
          <Button
            onClick={onClose}
            className="rounded-lg px-12 h-11 bg-[#1D5E84] hover:bg-[#154663] text-white font-medium cursor-pointer shadow-sm"
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
