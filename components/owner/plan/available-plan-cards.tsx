"use client"

import { useState, useMemo } from "react"
import { useAvailablePlans, useActiveSubscription } from "@/hooks/owner/use-subscription"
import { UpgradePlanDialog } from "@/components/owner/plan/upgrade-plan-dialog"
import { formatRupiah } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Store, ShieldCheck, Zap } from "lucide-react"
import type { SubscriptionPlan } from "@/types/owner/subscription"

function PlanCard({
  plans,
  activeSub,
  isPending,
  onSelectPlan,
}: {
  plans: SubscriptionPlan[]
  activeSub: any
  isPending: boolean
  onSelectPlan: (planId: string) => void
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const selectedPlan = plans[selectedIndex]

  const isDowngrade = (planCapacity: number | 'Unlimited', activeCapacity: number | 'Unlimited') => {
    if (activeCapacity === 'Unlimited') {
      return planCapacity !== 'Unlimited'; // Anything finite is a downgrade from Unlimited
    }
    if (planCapacity === 'Unlimited') {
      return false; // Unlimited is never a downgrade from a finite number
    }
    return planCapacity < activeCapacity;
  }

  return (
    <div 
      className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col h-[480px] relative transition-all"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 8px 28px 0 rgba(251,99,0,0.28), 0 2px 8px 0 rgba(251,99,0,0.14)'
          : '0 1px 3px 0 rgba(0,0,0,0.08)',
        outline: hovered ? '2px solid #FB6300' : '2px solid transparent',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease, outline 0.22s ease',
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-gray-900">{selectedPlan.nama_plan}</h3>
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border-none">Baru</Badge>
      </div>
      
      <div className="mb-2 flex flex-col gap-1 min-h-[48px] justify-end">
        <div className="text-4xl leading-none font-bold text-[#0F172A]">
          {selectedPlan.harga === 0 ? "Gratis" : formatRupiah(selectedPlan.harga)}
        </div>
      </div>

      <div className="mb-4">
        <div className="text-[#94A3B8] text-sm font-medium mb-2">Mulai dari</div>
        {plans.length > 1 ? (
          <div className="flex flex-wrap gap-2">
            {plans.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => setSelectedIndex(idx)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedIndex === idx
                    ? 'bg-[#0F172A] text-white'
                    : 'bg-[#F1F5F9] text-[#475569] hover:bg-gray-200'
                }`}
              >
                {p.is_lifetime ? "Selamanya" : `${p.durasi_hari} Hari`}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#F1F5F9] text-[#475569] px-3 py-1 rounded-full text-sm">
              {selectedPlan.is_lifetime ? "Selamanya" : `${selectedPlan.durasi_hari} Hari`}
            </span>
          </div>
        )}
      </div>
      
      <p className="text-[#64748B] text-base mb-6 h-12 line-clamp-2">{selectedPlan.deskripsi}</p>

      <div className="border-t border-gray-100 my-4"></div>

      <ul className="space-y-4 mb-6 flex-1">
        <li className="flex items-center text-sm font-medium text-[#0F172A]">
          <Store className="w-5 h-5 mr-3 text-[#0F172A]" />
          {selectedPlan.batas_outlet === 'Unlimited' ? 'Akses Tanpa Batas Outlet' : `${selectedPlan.batas_outlet} Outlet`}
        </li>
      </ul>

      <button 
        onClick={() => onSelectPlan(selectedPlan.id)}
        disabled={isPending}
        className={`w-full text-sm font-semibold py-3 px-4 rounded-xl mt-auto transition-colors cursor-pointer ${isPending ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-[#EA580C] hover:bg-[#c2410c] text-white shadow-sm'}`}
      >
        {isPending 
          ? 'Menunggu Konfirmasi' 
          : activeSub && isDowngrade(selectedPlan.batas_outlet, activeSub.plan.batas_outlet)
            ? `Turunkan ke ${selectedPlan.nama_plan}` 
            : `Tingkatkan ke ${selectedPlan.nama_plan}`}
      </button>
    </div>
  )
}

export function AvailablePlanCards() {
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")

  const { data: availablePlans } = useAvailablePlans()
  const { data: activeSub } = useActiveSubscription()

  const isPending = activeSub?.status === 'pending'

  const groupedPlans = useMemo(() => {
    if (!availablePlans) return []
    const groups: Record<string, typeof availablePlans> = {}
    for (const plan of availablePlans) {
      if (!groups[plan.nama_plan]) groups[plan.nama_plan] = []
      groups[plan.nama_plan].push(plan)
    }
    return Object.values(groups)
  }, [availablePlans])

  if (!availablePlans) return null

  return (
    <>
      {groupedPlans.map((group, index) => (
        <PlanCard 
          key={index} 
          plans={group} 
          activeSub={activeSub} 
          isPending={isPending} 
          onSelectPlan={(id) => {
            setSelectedPlanId(id)
            setUpgradeOpen(true)
          }}
        />
      ))}
      <UpgradePlanDialog
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        planId={selectedPlanId}
      />
    </>
  )
}