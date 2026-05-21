"use client"

import { useState } from "react"
import { Settings, Bell, Loader2 } from "lucide-react"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { UpgradePlanDialog } from "@/components/plan/upgrade-plan-dialog"
import { useActiveSubscription, useAvailablePlans } from "@/hooks/use-subscription"

export default function PlanPage() {
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string>("")
  const { data: activeSub, isLoading: loadingSub } = useActiveSubscription()
  const { data: availablePlans, isLoading: loadingPlans } = useAvailablePlans()

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number)
  }

  const isPending = activeSub?.status === 'pending'

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <span className="text-sm text-muted-foreground">KELOLA</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm">Plan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <button type="button" className="flex items-center justify-center size-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Settings">
            <Settings className="size-4" />
          </button>
          <button type="button" className="relative flex items-center justify-center size-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Notifications">
            <Bell className="size-4" />
            <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-orange-500 ring-2 ring-white" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-8 space-y-6">
        {/* Header Text */}
        <div className="pb-4 border-b border-gray-400/50 max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-800">Plan</h2>
          <p className="text-sm text-gray-500 mt-0.5">Mengelola subscription tenant</p>
        </div>

        {loadingSub || loadingPlans ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {/* Active Plan Card */}
            {activeSub && (
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
            )}

            {/* Available Plans (Upgrade Options) */}
            {availablePlans && availablePlans.map((plan) => (
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
          </div>
        )}
      </main>

      <UpgradePlanDialog 
        open={upgradeOpen} 
        onOpenChange={setUpgradeOpen} 
        planId={selectedPlanId} 
      />
    </div>
  )
}
