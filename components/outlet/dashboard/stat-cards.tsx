import { CircleDollarSign, ClipboardList, TrendingDown } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import type { KeuanganSummary } from "@/services/outlet/dashboard-service"

interface OutletStatCardsProps {
  keuangan?: KeuanganSummary;
}

export function OutletStatCards({ keuangan }: OutletStatCardsProps) {
  // Format mata uang ke Rupiah
  const formatRp = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">For Your Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={CircleDollarSign}
          label="Profits"
          value={keuangan ? formatRp(keuangan.total_keuntungan || 0) : "Rp 0"}
          gradient="bg-emerald-500"
        />
        <StatCard
          icon={ClipboardList}
          label="Gross Revenue"
          value={keuangan ? formatRp(keuangan.total_pendapatan || 0) : "Rp 0"}
          gradient="bg-blue-500"
        />
        <StatCard
          icon={TrendingDown}
          label="Losses"
          value={keuangan ? formatRp(keuangan.total_pengeluaran || 0) : "Rp 0"}
          gradient="bg-red-500"
        />
      </div>
    </div>
  )
}
