"use client"

import { useState } from "react"
import { useAvailablePlans, useActiveSubscription } from "@/hooks/owner/use-subscription"
import { UpgradePlanDialog } from "@/components/owner/plan/upgrade-plan-dialog"
import { Badge } from "@/components/ui/badge"
import { Store, ShieldCheck, Zap } from "lucide-react"
import { PlanCard } from "@/components/ui/plan-card"

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
        <div key={plan.id} className="w-[300px] shrink-0">
          <PlanCard
            name={plan.nama_plan}
            price={plan.harga}
            description="Tingkatkan efisiensi dengan akses diperluas"
            className="bg-[#F9FAFB]"
            headerBadge={
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border-none">
                Baru
              </Badge>
            }
            features={[
              {
                icon: <Zap className="w-4 h-4" />,
                text: 'Prioritas Layanan Utama'
              },
              {
                icon: <Store className="w-4 h-4" />,
                text: plan.batas_outlet === 'Unlimited'
                  ? 'Akses Tanpa Batas Outlet'
                  : `Kapasitas ${plan.batas_outlet} Outlet`
              },
              {
                icon: <ShieldCheck className="w-4 h-4" />,
                text: 'Keamanan Data Tingkat Lanjut'
              }
            ]}
            actionButton={
              <button
                onClick={() => {
                  setSelectedPlanId(plan.id)
                  setUpgradeOpen(true)
                }}
                disabled={isPending}
                className={`w-full text-sm font-semibold py-3 px-4 rounded-xl transition-colors cursor-pointer ${isPending
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-[#EA580C] hover:bg-[#c2410c] text-white shadow-sm'
                  }`}
              >
                {isPending ? 'Menunggu Konfirmasi Upgrade' : `Tingkatkan ke ${plan.nama_plan}`}
              </button>
            }
          />
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