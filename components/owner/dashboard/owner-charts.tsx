"use client"

import { useState } from "react"
import { ChevronDown, Loader2 } from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useDashboardGraph } from "@/hooks/use-dashboard"
import { MetricChart, type MetricDataPoint } from "@/components/dashboard/metric-chart"
import { cn, formatDateLabel } from "@/lib/utils"

const rangeLabels: Record<string, string> = {
  "1day": "Hari Ini",
  "7days": "7 Hari Terakhir",
  "30days": "30 Hari Terakhir"
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAggregatedData = (response: any, type: 'pendapatan' | 'kerugian'): MetricDataPoint[] => {
  let rawGrafik = response?.data?.grafik
  if (!rawGrafik && response?.data?.per_outlet) {
    const agg: Record<string, number> = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response.data.per_outlet.forEach((outlet: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rawGrafik?.map((g: any) => ({
    label: formatDateLabel(g.tanggal),
    value: Number(type === 'pendapatan' ? g.total_pendapatan : g.total_kerugian) || 0
  })) || []
}

export function OwnerCharts() {
  const [rangePendapatan, setRangePendapatan] = useState("30days")
  const [rangeKerugian, setRangeKerugian] = useState("30days")

  const { data: graphPendapatanResponse, isLoading: graphPendapatanLoading } = useDashboardGraph(rangePendapatan)
  const { data: graphKerugianResponse, isLoading: graphKerugianLoading } = useDashboardGraph(rangeKerugian)

  const pendapatanData = getAggregatedData(graphPendapatanResponse, 'pendapatan')
  const kerugianData = getAggregatedData(graphKerugianResponse, 'kerugian')

  return (
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
  )
}
