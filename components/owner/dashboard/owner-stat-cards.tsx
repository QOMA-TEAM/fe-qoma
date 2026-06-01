"use client"

import { Home, CircleDollarSign, TrendingDown } from "lucide-react"
import { useDashboardSummary } from "@/hooks/use-dashboard"
import { StatCard } from "@/components/dashboard/stat-card"
import { formatRupiah } from "@/lib/utils"

export function OwnerStatCards() {
  const { data: summaryResponse } = useDashboardSummary()
  const summary = summaryResponse?.data?.ringkasan

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        icon={Home}
        label="Total Outlet"
        value={(summary?.total_outlet || 0).toString()}
        gradient="bg-[#2D45B8]"
        className="h-[160px] flex flex-col justify-between"
      />
      <StatCard
        icon={CircleDollarSign}
        label="Total Pendapatan"
        value={formatRupiah(summary?.total_pendapatan || 0)}
        gradient="bg-[#44A5E6]"
        className="h-[160px] flex flex-col justify-between"
      />
      <StatCard
        icon={TrendingDown}
        label="Total Kerugian"
        value={formatRupiah(summary?.total_kerugian || 0)}
        gradient="bg-[#F69C35]"
        className="h-[160px] flex flex-col justify-between"
      />
    </div>
  )
}
