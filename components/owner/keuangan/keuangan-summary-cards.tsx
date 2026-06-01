"use client"

import { Store, Coins, TrendingDown, CircleDollarSign, Loader2 } from "lucide-react"
import { useKeuanganSummary } from "@/hooks/use-keuangan"
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
      <div className="flex justify-center items-center h-32">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[#2A49B8] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-2 rounded-lg">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium opacity-90">Total Pendapatan</span>
        </div>
        <h3 className="text-2xl font-bold">{formatRupiah(summary.total_pendapatan)}</h3>
      </div>

      <div className="bg-[#29A364] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-2 rounded-lg">
            <Coins className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium opacity-90">Total Pengeluaran</span>
        </div>
        <h3 className="text-2xl font-bold">{formatRupiah(summary.total_pengeluaran)}</h3>
      </div>

      <div className="bg-[#F29C38] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-2 rounded-lg">
            <TrendingDown className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium opacity-90">Total Kerugian</span>
        </div>
        <h3 className="text-2xl font-bold">{formatRupiah(summary.total_kerugian)}</h3>
      </div>

      <div className="bg-[#5A9BE7] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-2 rounded-lg">
            <CircleDollarSign className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium opacity-90">Total Keuntungan</span>
        </div>
        <h3 className="text-2xl font-bold">{formatRupiah(summary.total_keuntungan)}</h3>
        <CircleDollarSign className="absolute -bottom-6 -right-4 w-32 h-32 text-white/10" />
      </div>
    </div>
  )
}
