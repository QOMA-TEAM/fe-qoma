"use client"

import { useState } from "react"
import { Home, CircleDollarSign, TrendingDown, ChevronDown, Loader2, Settings, Bell } from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useDashboardSummary, useDashboardGraph, useActivityLog } from "@/hooks/use-dashboard"
import { useProfile } from "@/hooks/use-auth"
import { MetricChart, type MetricDataPoint } from "@/components/dashboard/metric-chart"
import { HeaderActions } from "@/components/dashboard/header-actions"
import { cn } from "@/lib/utils"

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number)
}

export default function OwnerDashboardPage() {
  const [rangePendapatan, setRangePendapatan] = useState("30days")
  const [rangeKerugian, setRangeKerugian] = useState("30days")

  const { data: profile } = useProfile()
  const { data: summaryResponse, isLoading: summaryLoading } = useDashboardSummary()
  const { data: graphPendapatanResponse, isLoading: graphPendapatanLoading } = useDashboardGraph(rangePendapatan)
  const { data: graphKerugianResponse, isLoading: graphKerugianLoading } = useDashboardGraph(rangeKerugian)
  const { data: activityResponse, isLoading: activityLoading } = useActivityLog(1, 15)

  const summary = summaryResponse?.data?.ringkasan

  // Formatting dates (e.g., "2026-05-17" -> "May 17" or just "17 May")
  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getAggregatedData = (response: any, type: 'pendapatan' | 'kerugian'): MetricDataPoint[] => {
    let rawGrafik = response?.data?.grafik
    if (!rawGrafik && response?.data?.per_outlet) {
      const agg: Record<string, number> = {}
      response.data.per_outlet.forEach((outlet: any) => {
        outlet.grafik?.forEach((g: any) => {
          agg[g.tanggal] = (agg[g.tanggal] || 0) + Number(type === 'pendapatan' ? g.total_pendapatan : g.total_kerugian)
        })
      })
      rawGrafik = Object.keys(agg).sort().map(tanggal => ({
        tanggal,
        total_pendapatan: type === 'pendapatan' ? agg[tanggal] : 0,
        total_kerugian: type === 'kerugian' ? agg[tanggal] : 0,
      }))
    }

    return rawGrafik?.map((g: any) => ({
      label: formatDateLabel(g.tanggal),
      value: Number(type === 'pendapatan' ? g.total_pendapatan : g.total_kerugian) || 0
    })) || []
  }

  const pendapatanData = getAggregatedData(graphPendapatanResponse, 'pendapatan')
  const kerugianData = getAggregatedData(graphKerugianResponse, 'kerugian')

  const activities = activityResponse?.data || []

  const rangeLabels: Record<string, string> = {
    "1day": "Hari Ini",
    "7days": "7 Hari Terakhir",
    "30days": "30 Hari Terakhir"
  }

  if (summaryLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2C44B9]" />
      </div>
    )
  }

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Outlet */}
        <div className="bg-[#2D45B8] text-white rounded-2xl p-6 shadow-md relative overflow-hidden h-[160px] flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-lg">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-[15px] font-medium opacity-90">Total Outlet</span>
          </div>
          <h3 className="text-[36px] font-bold tracking-tight">{summary?.total_outlet || 0}</h3>
        </div>

        {/* Total Pendapatan */}
        <div className="bg-[#44A5E6] text-white rounded-2xl p-6 shadow-md relative overflow-hidden h-[160px] flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-lg">
              <CircleDollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-[15px] font-medium opacity-90">Total Pendapatan</span>
          </div>
          <h3 className="text-[36px] font-bold tracking-tight truncate">
            {formatRupiah(summary?.total_pendapatan || 0)}
          </h3>
        </div>

        {/* Total Kerugian */}
        <div className="bg-[#F69C35] text-white rounded-2xl p-6 shadow-md relative overflow-hidden h-[160px] flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-lg">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <span className="text-[15px] font-medium opacity-90">Total Kerugian</span>
          </div>
          <h3 className="text-[36px] font-bold tracking-tight truncate">
            {formatRupiah(summary?.total_kerugian || 0)}
          </h3>
        </div>
      </div>

      {/* Bottom Grid: 2 Charts + Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: 2 Charts */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pendapatan Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F1F5F9] flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[#1E293B] font-bold text-lg">Pendapatan</h4>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-white border-[#E2E8F0] shadow-sm rounded-lg text-[#334155] font-medium w-[140px] justify-between text-xs h-8">
                    {rangeLabels[rangePendapatan]} <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[140px]">
                  {Object.entries(rangeLabels).map(([key, label]) => (
                    <DropdownMenuItem 
                      key={key} 
                      onClick={() => setRangePendapatan(key)} 
                      className={cn("cursor-pointer text-xs", rangePendapatan === key && "font-semibold text-[#2C44B9]")}
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex-1 w-full relative">
              {graphPendapatanLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-[#94A3B8]" />
                </div>
              ) : (
                <MetricChart data={pendapatanData} labelName="Pendapatan" color="#F97316" />
              )}
            </div>
          </div>

          {/* Kerugian Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F1F5F9] flex flex-col h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-[#1E293B] font-bold text-lg">Kerugian</h4>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-white border-[#E2E8F0] shadow-sm rounded-lg text-[#334155] font-medium w-[140px] justify-between text-xs h-8">
                    {rangeLabels[rangeKerugian]} <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[140px]">
                  {Object.entries(rangeLabels).map(([key, label]) => (
                    <DropdownMenuItem 
                      key={key} 
                      onClick={() => setRangeKerugian(key)} 
                      className={cn("cursor-pointer text-xs", rangeKerugian === key && "font-semibold text-[#2C44B9]")}
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex-1 w-full relative">
              {graphKerugianLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-[#94A3B8]" />
                </div>
              ) : (
                <MetricChart data={kerugianData} labelName="Kerugian" color="#F97316" />
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Activity Log */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F1F5F9] flex flex-col h-[400px]">
          <div className="mb-6">
            <h4 className="text-[#1E293B] font-bold text-lg">Activity Log</h4>
            <p className="text-[#44A5E6] text-sm font-medium">History</p>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 pb-4">
            {activityLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-[#94A3B8]" />
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-10 text-sm text-[#94A3B8]">Belum ada aktivitas.</div>
            ) : (
              <div className="relative border-l-2 border-[#E2E8F0] ml-4 mt-2 space-y-6">
                {activities.map((item, index) => {
                  const date = new Date(item.created_at)
                  const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
                  
                  return (
                    <div key={item.id} className="relative flex items-start pl-6">
                      {/* Stepper Dot */}
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-[3px] border-[#F69C35]" />
                      
                      <div className="flex flex-col">
                        <span className="text-[#1E293B] font-bold text-sm leading-tight mb-1">{item.aktivitas}</span>
                        <span className="text-[#44A5E6] text-xs font-semibold">{timeString}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
