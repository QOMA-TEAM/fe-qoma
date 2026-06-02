"use client"

import { useProfile } from "@/hooks/use-auth"
import { HeaderActions } from "@/components/dashboard/header-actions"
import { OwnerStatCards } from "@/components/owner/dashboard/owner-stat-cards"
import { OwnerCharts } from "@/components/owner/dashboard/owner-charts"
import { OwnerActivityLog } from "@/components/owner/dashboard/owner-activity-log"

export default function OwnerDashboardPage() {
  const { data: profile } = useProfile()

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Top Header Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <h2 className="text-[#1E293B] text-[15px] font-bold">
          Welcome back, {profile?.username || 'Owner'}
        </h2>
        <HeaderActions />
      </header>

      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-[#1E293B]">Dashboard</h1>
          <p className="text-sm font-medium text-[#64748B] mt-1">Ringkasan aktivitas bisnis Anda</p>
        </div>

        {/* Top 3 Cards Grid */}
        <OwnerStatCards />

        {/* Bottom Grid: 2 Charts + Activity Log */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <OwnerCharts />
          <OwnerActivityLog />
        </div>
      </div>
    </div>
  )
}
