"use client"

import { Store, Coins, TrendingDown, CircleDollarSign, AlertTriangle, TrendingUp } from "lucide-react"
import { formatRupiah } from "@/lib/utils"
import type { OutletKeuanganCards } from "@/types/outlet/keuangan"

interface Props {
  cards?: OutletKeuanganCards
  isLoading: boolean
}

export function DetailKeuanganCards({ cards, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Summary Cards Skeleton */}
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
      </div>
    )
  }

  const totalPendapatan = cards?.total_pendapatan ?? 0
  const totalPengeluaran = cards?.total_pengeluaran ?? 0
  const totalKerugian = cards?.total_kerugian ?? 0
  const totalKeuntunganRaw = cards?.total_keuntungan ?? 0
  
  const displayKeuntungan = totalKeuntunganRaw > 0 ? totalKeuntunganRaw : 0
  const displayKerugian = totalKeuntunganRaw < 0 ? Math.abs(totalKeuntunganRaw) : totalKerugian

  const status = cards?.status ?? "untung"
  const pesan = cards?.pesan ?? ""

  return (
    <div className="space-y-4">
      {/* Status banner */}
      {pesan && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${status === "untung"
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}>
          {status === "untung"
            ? <TrendingUp className="w-4 h-4 shrink-0" />
            : <AlertTriangle className="w-4 h-4 shrink-0" />}
          {pesan}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pendapatan */}
        <div className="bg-[#2A49B8] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium opacity-90">Total Pendapatan</span>
            </div>
            <h3 className="text-2xl font-bold">{formatRupiah(totalPendapatan)}</h3>
            <Store className="absolute -bottom-6 -right-4 w-28 h-28 text-white/10" />
          </div>
        </div>

        {/* Keuntungan */}
        <div className="bg-[#29A364] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <CircleDollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium opacity-90">Total Keuntungan</span>
            </div>
            <h3 className="text-2xl font-bold">{formatRupiah(displayKeuntungan)}</h3>
            <CircleDollarSign className="absolute -bottom-6 -right-4 w-28 h-28 text-white/10" />
          </div>
        </div>
      
        {/* Pengeluaran */}
        <div className="bg-[#F29C38] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium opacity-90">Total Pengeluaran</span>
            </div>
            <h3 className="text-2xl font-bold">{formatRupiah(totalPengeluaran)}</h3>
            <Coins className="absolute -bottom-6 -right-4 w-28 h-28 text-white/10" />
          </div>
        </div>

        {/* Kerugian */}
        <div className="bg-rose-500 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium opacity-90">Total Kerugian</span>
            </div>
            <h3 className="text-2xl font-bold">{formatRupiah(displayKerugian)}</h3>
            <TrendingDown className="absolute -bottom-6 -right-4 w-28 h-28 text-white/10" />
          </div>
        </div>
      </div>
    </div>
  )
}
