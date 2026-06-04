import { CircleDollarSign, ClipboardList, TrendingDown } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"

export function OutletStatCards() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">For Your Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={CircleDollarSign}
          label="Profits"
          value="Rp 1.000.000"
          gradient="bg-emerald-500"
        />
        <StatCard
          icon={ClipboardList}
          label="Total Transaction"
          value="60"
          gradient="bg-orange-400"
        />
        <StatCard
          icon={TrendingDown}
          label="Losses"
          value="Rp.200.000"
          gradient="bg-red-500"
        />
      </div>
    </div>
  )
}
