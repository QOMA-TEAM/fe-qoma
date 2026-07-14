"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MapPin, CalendarDays, Store, Hash, CheckCircle2 } from "lucide-react"
import type { Outlet } from "@/types/owner/outlet"

interface DetailOutletDialogProps {
  outlet: Outlet | null
  onClose: () => void
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between py-2.5 border-b border-gray-100 last:border-b-0 gap-4">
            <span className="text-sm text-gray-500 shrink-0">{label}</span>
            <span className="text-sm font-medium text-gray-800 text-right wrap-break-word max-w-[60%]">{value ?? '-'}</span>
        </div>
    )
}

export function DetailOutletDialog({ outlet, onClose }: DetailOutletDialogProps) {
  if (!outlet) return null

  const initials = outlet.nama_outlet
      .split(" ")
      .slice(0, 2)
      .map((w: string) => w[0] || "")
      .join("")
      .toUpperCase()

  return (
    <Dialog open={!!outlet} onOpenChange={(open: boolean) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl gap-0">
        
        {/* ── Header ── */}
        <div className="bg-linear-to-br from-[#FF6600] to-[#FF8C42] px-6 pt-6 pb-6">
            <DialogHeader>
                <DialogTitle className="text-white/70 text-sm font-medium mb-3">
                    Detail Outlet
                </DialogTitle>
            </DialogHeader>

            {/* Avatar + Info Ringkas */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {initials}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="text-white text-lg font-bold leading-tight truncate">{outlet.nama_outlet}</h3>
                    <p className="text-white/70 text-sm mt-0.5 truncate">{outlet.email || '-'}</p>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={12} /> Aktif
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* ── Content ── */}
        <div className="px-6 py-4 min-h-[200px] max-h-[60vh] overflow-y-auto">
            <InfoRow label="ID Outlet" value={
                <span className="flex items-center gap-1 justify-end">
                    <Hash size={13} className="text-gray-400 shrink-0" />
                    <span title={String(outlet.id)}>{String(outlet.id).length > 8 ? `${String(outlet.id).slice(0, 8)}...` : outlet.id}</span>
                </span>
            } />
            <InfoRow label="Alamat" value={
                <span className="flex items-start gap-1 justify-end">
                    <MapPin size={13} className="text-gray-400 mt-0.5 shrink-0" />
                    <span>{outlet.alamat || '-'}</span>
                </span>
            } />
            <InfoRow label="Jumlah Meja" value={outlet.mejas_count || 0} />
            <InfoRow label="Created At" value={
                <span className="flex items-center gap-1 justify-end">
                    <CalendarDays size={13} className="text-gray-400 shrink-0" />
                    {outlet.created_at ? new Date(outlet.created_at).toLocaleDateString("id-ID") : '-'}
                </span>
            } />
            <InfoRow label="Updated At" value={
                <span className="flex items-center gap-1 justify-end">
                    <CalendarDays size={13} className="text-gray-400 shrink-0" />
                    {outlet.updated_at ? new Date(outlet.updated_at).toLocaleDateString("id-ID") : '-'}
                </span>
            } />
            
            <div className="flex justify-end mt-6">
                <Button
                    onClick={onClose}
                    className="rounded-lg px-8 bg-[#1D5E84] hover:bg-[#154663] text-white cursor-pointer"
                >
                    Tutup
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

