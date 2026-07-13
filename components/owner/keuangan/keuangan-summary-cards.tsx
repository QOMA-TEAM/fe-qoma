"use client"

import { Store, Coins, TrendingDown, TrendingUp, Loader2 } from "lucide-react"
import { useKeuanganSummary } from "@/hooks/owner/use-keuangan"
import { formatRupiah } from "@/lib/utils"

interface KeuanganSummaryCardsProps {
  range: string
  outletId: string
}

export function KeuanganSummaryCards({ range, outletId }: KeuanganSummaryCardsProps) {
  const { data: summaryResponse, isLoading } = useKeuanganSummary(range, outletId || undefined)
  const summary = summaryResponse?.data

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-100 p-6 rounded-2xl shadow-sm relative overflow-hidden animate-pulse h-[132px]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gray-200 rounded-lg" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
            <div className="h-7 w-32 bg-gray-200 rounded mt-2" />
          </div>
        ))}
      </div>
    )
  }

  if (!summary) return null

  const keuntungan = Math.max(0, summary.total_keuntungan)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Pendapatan */}
      <div className="bg-[#2A49B8] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-2 rounded-lg">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium opacity-90">Total Pendapatan</span>
        </div>
        <h3 className="text-2xl font-bold">{formatRupiah(summary.total_pendapatan)}</h3>
        <Store className="absolute -bottom-6 -right-4 w-32 h-32 text-white/10" />
      </div>

      {/* Total Keuntungan */}
      <div className="bg-[#29A364] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium opacity-90">Total Keuntungan</span>
        </div>
        <h3 className="text-2xl font-bold">{formatRupiah(keuntungan)}</h3>
        <TrendingUp className="absolute -bottom-6 -right-4 w-32 h-32 text-white/10" />
      </div>

      {/* Total Pengeluaran */}
      <div className="bg-[#F29C38] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-2 rounded-lg">
            <Coins className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium opacity-90">Total Pengeluaran</span>
        </div>
        <h3 className="text-2xl font-bold">{formatRupiah(summary.total_pengeluaran)}</h3>
        <Coins className="absolute -bottom-6 -right-4 w-32 h-32 text-white/10" />
      </div>

      {/* Total Kerugian */}
      <div className="bg-[#E53E3E] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-2 rounded-lg">
            <TrendingDown className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium opacity-90">Total Kerugian</span>
        </div>
        <h3 className="text-2xl font-bold">{formatRupiah(summary.total_kerugian)}</h3>
        <TrendingDown className="absolute -bottom-6 -right-4 w-32 h-32 text-white/10" />
      </div>
    </div>
  )
}
