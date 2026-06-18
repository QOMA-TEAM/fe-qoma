"use client"

import { Badge } from "@/components/ui/badge"
import { useActiveSubscription } from "@/hooks/owner/use-subscription"
import { formatRupiah } from "@/lib/utils"
import { Store, CheckCircle2, Star } from "lucide-react"

export function ActivePlanCard() {
  const { data: activeSub } = useActiveSubscription()

  if (!activeSub) return null

  const isPending = activeSub.status === 'pending'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col h-[480px] shadow-sm relative">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-gray-900">{activeSub.plan.nama_plan}</h3>
        {isPending && (
          <Badge variant="outline" className="rounded-full px-3 text-xs font-medium py-1 border-yellow-400 text-yellow-600 bg-yellow-50">
            Pending
          </Badge>
        )}
      </div>
      
      <div className="mb-2 flex flex-wrap items-end gap-x-2 gap-y-1">
        <div className="text-2xl leading-none font-bold text-gray-900">{activeSub.plan.harga === 0 ? "Gratis" : formatRupiah(activeSub.plan.harga)}</div>
        {activeSub.plan.is_lifetime ? (
          <div className="text-gray-400 text-sm font-medium mb-1 whitespace-nowrap">Selamanya</div>
        ) : (
          <div className="text-gray-400 text-sm font-medium mb-1 whitespace-nowrap">IDR / {activeSub.plan.durasi_hari} Hari</div>
        )}
      </div>
      
      <p className="text-gray-500 text-sm mb-6">{activeSub.plan.deskripsi}</p>

      <button disabled className="w-full text-sm font-semibold py-3 px-4 rounded-xl border border-gray-300 text-gray-700 bg-transparent mb-8">
        {isPending ? 'Menunggu Pembayaran' : 'Paket Anda saat ini'}
      </button>

      <ul className="space-y-4 flex-1">
        <li className="flex items-center text-sm font-medium text-gray-600">
          <Store className="w-4 h-4 mr-3 text-gray-400" />
          {activeSub.plan.batas_outlet === 'Unlimited' ? 'Unlimited Outlet' : `${activeSub.plan.batas_outlet} Outlet`}
        </li>
        <li className="flex items-center text-sm font-medium text-gray-600">
          <CheckCircle2 className="w-4 h-4 mr-3 text-gray-400" />
          Telah digunakan: {activeSub.penggunaan_outlet.dipakai} Outlet
        </li>
      </ul>
    </div>
  )
}