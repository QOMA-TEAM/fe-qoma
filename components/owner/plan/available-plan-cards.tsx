"use client"

import { useState } from "react"
import { useAvailablePlans, useActiveSubscription } from "@/hooks/owner/use-subscription"
import { UpgradePlanDialog } from "@/components/owner/plan/upgrade-plan-dialog"
import { formatRupiah } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Store, ShieldCheck, Zap } from "lucide-react"

export function AvailablePlanCards() {
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  
  const { data: availablePlans } = useAvailablePlans()
  const { data: activeSub } = useActiveSubscription()

  const isPending = activeSub?.status === 'pending'

  const isDowngrade = (planCapacity: number | 'Unlimited', activeCapacity: number | 'Unlimited') => {
    if (activeCapacity === 'Unlimited') {
      return planCapacity !== 'Unlimited'; // Anything finite is a downgrade from Unlimited
    }
    if (planCapacity === 'Unlimited') {
      return false; // Unlimited is never a downgrade from a finite number
    }
    return planCapacity < activeCapacity;
  }

  if (!availablePlans) return null

  return (
    <>
      {availablePlans.map((plan) => (
        <div key={plan.id} className="bg-[#F9FAFB] rounded-xl border border-gray-200 p-8 flex flex-col h-[480px] shadow-sm relative">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-gray-900">{plan.nama_plan}</h3>
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border-none">Baru</Badge>
          </div>
          
          <div className="mb-2 flex flex-wrap items-end gap-x-2 gap-y-1">
            <div className="text-2xl leading-none font-bold text-gray-900">{plan.harga === 0 ? "Gratis" : formatRupiah(plan.harga)}</div>
            {plan.is_lifetime ? (
              <div className="text-gray-400 text-sm font-medium mb-1 whitespace-nowrap">Selamanya</div>
            ) : (
              <div className="text-gray-400 text-sm font-medium mb-1 whitespace-nowrap">IDR / {plan.durasi_hari} Hari</div>
            )}
          </div>
          
          <p className="text-gray-500 text-sm mb-6">{plan.deskripsi}</p>

          <button 
            onClick={() => {
              setSelectedPlanId(plan.id)
              setUpgradeOpen(true)
            }}
            disabled={isPending}
            className={`w-full text-sm font-semibold py-3 px-4 rounded-xl mb-8 transition-colors cursor-pointer ${isPending ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#EA580C] hover:bg-[#c2410c] text-white shadow-sm'}`}
          >
            {isPending 
              ? 'Menunggu Konfirmasi' 
              : activeSub && isDowngrade(plan.batas_outlet, activeSub.plan.batas_outlet)
                ? `Turunkan ke ${plan.nama_plan}` 
                : `Tingkatkan ke ${plan.nama_plan}`}
          </button>

          <ul className="space-y-4 flex-1">
            <li className="flex items-center text-sm font-medium text-gray-600">
              <Zap className="w-4 h-4 mr-3 text-[#EA580C]" />
              Prioritas Layanan Utama
            </li>
            <li className="flex items-center text-sm font-medium text-gray-600">
              <Store className="w-4 h-4 mr-3 text-[#EA580C]" />
              {plan.batas_outlet === 'Unlimited' ? 'Akses Tanpa Batas Outlet' : `Kapasitas ${plan.batas_outlet} Outlet`}
            </li>
            <li className="flex items-center text-sm font-medium text-gray-600">
              <ShieldCheck className="w-4 h-4 mr-3 text-[#EA580C]" />
              Keamanan Data Tingkat Lanjut
            </li>
          </ul>
        </div>
      ))}
      <UpgradePlanDialog 
        open={upgradeOpen} 
        onOpenChange={setUpgradeOpen} 
        planId={selectedPlanId} 
      />
    </>
  )
}
