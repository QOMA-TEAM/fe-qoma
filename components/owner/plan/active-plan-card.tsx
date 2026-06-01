"use client"

import { Badge } from "@/components/ui/badge"
import { useActiveSubscription } from "@/hooks/use-subscription"
import { formatRupiah } from "@/lib/utils"

export function ActivePlanCard() {
  const { data: activeSub } = useActiveSubscription()

  if (!activeSub) return null

  const isPending = activeSub.status === 'pending'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col h-[380px] shadow-sm relative">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-2xl font-bold text-gray-900">{activeSub.plan.nama_plan}</h3>
        <Badge variant="outline" className={`rounded-full px-5 text-sm font-medium py-1 ${isPending ? 'border-yellow-400 text-yellow-600 bg-yellow-50' : 'border-emerald-400 text-emerald-600 bg-emerald-50'}`}>
          {isPending ? 'Pending' : 'Aktif'}
        </Badge>
      </div>
      
      <div className="mb-4">
        <div className="text-[32px] leading-none font-bold text-gray-900 mb-2">{formatRupiah(activeSub.plan.harga)}</div>
        <div className="text-gray-400 text-[15px] font-medium">Per 30 Hari</div>
      </div>

      <div className="border-t border-gray-800 my-6 w-full" />

      <ul className="space-y-4 mb-8 flex-1">
        <li className="flex items-center text-gray-500 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></span>
          {activeSub.plan.batas_outlet === 'Unlimited' ? 'Unlimited Outlet' : `${activeSub.plan.batas_outlet} Outlet`}
        </li>
        <li className="flex items-center text-gray-500 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></span>
          Telah digunakan: {activeSub.penggunaan_outlet.dipakai} Outlet
        </li>
      </ul>
    </div>
  )
}
