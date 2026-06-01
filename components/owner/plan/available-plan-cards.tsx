"use client"

import { useState } from "react"
import { useAvailablePlans, useActiveSubscription } from "@/hooks/owner/use-subscription"
import { UpgradePlanDialog } from "@/components/owner/plan/upgrade-plan-dialog"
import { formatRupiah } from "@/lib/utils"

export function AvailablePlanCards() {
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  
  const { data: availablePlans } = useAvailablePlans()
  const { data: activeSub } = useActiveSubscription()

  const isPending = activeSub?.status === 'pending'

  if (!availablePlans) return null

  return (
    <>
      {availablePlans.map((plan) => (
        <div key={plan.id} className="bg-[#F9FAFB] rounded-xl border border-gray-200 p-8 flex flex-col h-[380px] shadow-sm relative">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-bold text-gray-900">{plan.nama_plan}</h3>
          </div>
          
          <div className="mb-4">
            <div className="text-[32px] leading-none font-bold text-gray-900 mb-2">{formatRupiah(plan.harga)}</div>
            <div className="text-gray-400 text-[15px] font-medium">Per 30 Hari</div>
          </div>

          <div className="border-t border-gray-800 my-6 w-full" />

          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center text-gray-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></span>
              {plan.batas_outlet === 'Unlimited' ? 'Unlimited Outlet' : `${plan.batas_outlet} Outlet`}
            </li>
          </ul>

          <button 
            onClick={() => {
              setSelectedPlanId(plan.id)
              setUpgradeOpen(true)
            }}
            disabled={isPending}
            className={`w-full mt-auto text-white font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#EA580C] hover:bg-[#c2410c]'}`}
          >
            {isPending ? 'Menunggu Konfirmasi Upgrade' : 'Upgrade Plan'}
          </button>
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
