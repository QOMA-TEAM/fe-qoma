"use client"

import { Loader2 } from "lucide-react"
import { HeaderActions } from "@/components/dashboard/header-actions"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useActiveSubscription, useAvailablePlans } from "@/hooks/owner/use-subscription"
import { ActivePlanCard } from "@/components/owner/plan/active-plan-card"
import { AvailablePlanCards } from "@/components/owner/plan/available-plan-cards"

export default function PlanPage() {
  const { isLoading: loadingSub } = useActiveSubscription()
  const { isLoading: loadingPlans } = useAvailablePlans()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
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
        <HeaderActions />
      </header>

      <main className="flex-1 p-8 space-y-6">
        {/* Header Text */}
        <div className="pb-4 border-b border-gray-400/50 max-w-full">

        {/* Header Text */}
        <div className="pb-4 border-b border-gray-400/50 max-w-full">

          <h2 className="text-2xl font-bold text-gray-800">Plan</h2>
          <p className="text-sm text-gray-500 mt-0.5">Mengelola subscription tenant</p>
        </div>

        {loadingSub || loadingPlans ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-full">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-full">

            <ActivePlanCard />
            <AvailablePlanCards />
          </div>
        )}
      </main>
    </div>
  )
}