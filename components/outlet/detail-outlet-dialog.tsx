"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Outlet } from "@/app/(dashboard)/owner/outlet/page"

interface DetailOutletDialogProps {
  outlet: Outlet | null
  onClose: () => void
}

export function DetailOutletDialog({ outlet, onClose }: DetailOutletDialogProps) {
  if (!outlet) return null

  return (
    <Dialog open={!!outlet} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Detail Outlet
          </DialogTitle>
        </DialogHeader>

        <div className="border-t border-gray-200 my-1" />

        {/* Nama + Status */}
        <div className="flex items-center justify-between mt-2">
          <h3 className="text-lg font-bold text-gray-800">{outlet.namaPerusahaan}</h3>
          <Badge
            variant="outline"
            className={
              outlet.status === "Aktif"
                ? "border-emerald-400 text-emerald-600 bg-emerald-50 rounded-full px-4"
                : "border-red-400 text-red-600 bg-red-50 rounded-full px-4"
            }
          >
            {outlet.status}
          </Badge>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-4">
          {/* Left: Information Subscription */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3">Information Subscription</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subscription ID</span>
                <span className="text-gray-800 font-medium">{outlet.subscriptionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Plan ID</span>
                <span className="text-gray-800 font-medium">{outlet.planId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Start Date</span>
                <span className="text-gray-800 font-medium">{outlet.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">End Date</span>
                <span className="text-gray-800 font-medium">{outlet.endDate}</span>
              </div>
            </div>
          </div>

          {/* Right: Data Tenant */}
          <div>
            <h4 className="text-sm font-bold text-gray-700 mb-3">Data Tenant</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Nama Perusahaan</span>
                <span className="text-gray-800 font-medium">{outlet.namaPerusahaan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-800 font-medium">{outlet.emailAdmin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Alamat</span>
                <span className="text-gray-800 font-medium text-right max-w-[140px]">{outlet.alamatPerusahaan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Outlet</span>
                <span className="text-gray-800 font-medium">{outlet.totalOutlet}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Timestamp */}
        <div className="mt-4">
          <h4 className="text-sm font-bold text-gray-700 mb-3">Timestamp</h4>
          <div className="space-y-2 text-sm max-w-[280px]">
            <div className="flex justify-between">
              <span className="text-gray-500">Created At</span>
              <span className="text-gray-800 font-medium">{outlet.createdAt}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Updated At</span>
              <span className="text-gray-800 font-medium">{outlet.updatedAt}</span>
            </div>
          </div>
        </div>

        {/* Tutup Button */}
        <div className="flex justify-center mt-4">
          <Button
            onClick={onClose}
            className="rounded-full px-10 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
