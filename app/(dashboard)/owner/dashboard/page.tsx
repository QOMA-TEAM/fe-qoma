"use client"

import { Store, CircleDollarSign, TrendingDown, Settings, Bell } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatCard } from "@/components/dashboard/stat-card"
import { ActivityLog, type ActivityItem } from "@/components/dashboard/activity-log"
import { RevenueChart, type RevenueDataPoint } from "@/components/dashboard/revenue-chart"
import { CustomersChart, type CustomersDataPoint } from "@/components/dashboard/customers-chart"
import { OutletRevenueChart, type OutletRevenueDataPoint } from "@/components/dashboard/outlet-revenue-chart"

import { useDashboardSummary, useDashboardGraph, useActivityLog } from "@/hooks/use-dashboard"
import { Loader2 } from "lucide-react"

// ──────────────────────────────────────────────

export default function OwnerDashboardPage() {
  const { data: summaryResponse, isLoading: summaryLoading } = useDashboardSummary()
  const { data: graphResponse, isLoading: graphLoading } = useDashboardGraph("30days")
  const { data: activityResponse, isLoading: activityLoading } = useActivityLog(1, 10)

  const summary = summaryResponse?.data?.ringkasan

  // Backend doesn't return root `grafik` if outlet_id is not specified. It returns `per_outlet` array.
  // We need to aggregate it for the "Usaha" (all outlets) view.
  let rawGrafik = graphResponse?.data?.grafik
  
  if (!rawGrafik && graphResponse?.data?.per_outlet) {
    const aggregated: Record<string, number> = {}
    graphResponse.data.per_outlet.forEach((outlet: any) => {
      outlet.grafik?.forEach((g: any) => {
        aggregated[g.tanggal] = (aggregated[g.tanggal] || 0) + Number(g.total_pendapatan)
      })
    })
    rawGrafik = Object.keys(aggregated).sort().map(tanggal => ({
      tanggal,
      total_pendapatan: aggregated[tanggal],
      total_pengeluaran: 0,
      total_kerugian: 0,
      total_keuntungan: 0,
    }))
  }

  const graphData: RevenueDataPoint[] = rawGrafik?.map((g: any) => ({
    month: g.tanggal.substring(5, 10), // e.g. "05-17" from "2026-05-17"
    revenue: Number(g.total_pendapatan) || 0
  })) || []

  // Ambil data untuk tab "Outlet" dari outlet pertama jika ada
  const outletGraphData: RevenueDataPoint[] = graphResponse?.data?.per_outlet?.[0]?.grafik?.map((g: any) => ({
    month: g.tanggal.substring(5, 10),
    revenue: Number(g.total_pendapatan) || 0
  })) || graphData // fallback ke graphData jika kosong

  const defaultGraphData: RevenueDataPoint[] = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    return {
      month: d.toISOString().substring(5, 10),
      revenue: 0
    }
  })

  const finalGraphData = graphData.length > 0 ? graphData : defaultGraphData
  const finalOutletGraphData = outletGraphData.length > 0 ? outletGraphData : defaultGraphData

  // Real data for Outlet Revenue Bar Chart
  const realOutletRevenueData: OutletRevenueDataPoint[] = graphResponse?.data?.per_outlet?.map(outlet => ({
    outlet: outlet.nama_outlet || "Unknown",
    pendapatan: Number(outlet.total_pendapatan) || 0,
    pengeluaran: Number(outlet.total_pengeluaran) || 0
  })) || []

  const mappedActivities: ActivityItem[] = activityResponse?.data?.map((item, index) => ({
    id: index + 1, // Use index as the visible circle number
    title: item.aktivitas,
    time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })) || []

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      {/* ── Top Bar ── */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <h1 className="text-lg font-bold text-gray-800">
          Welcome back, <span className="text-gray-900">Owner</span>
        </h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex items-center justify-center size-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Settings"
          >
            <Settings className="size-4" />
          </button>
          <button
            type="button"
            className="relative flex items-center justify-center size-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
            <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-orange-500 ring-2 ring-white" />
          </button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Page heading */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Ringkasan aktivitas bisnis Anda
          </p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {summaryLoading ? (
             <div className="col-span-3 flex justify-center py-10"><Loader2 className="animate-spin text-blue-600 size-8" /></div>
          ) : (
            <>
              <StatCard
                icon={Store}
                label="Total Outlet"
                value={(summary?.total_outlet || 0).toString()}
                gradient="bg-[#2A49B8]"
              />
              <StatCard
                icon={CircleDollarSign}
                label="Total Pendapatan"
                value={`Rp ${Number(summary?.total_pendapatan || 0).toLocaleString("id-ID")}`}
                gradient="bg-[#56A6FF]"
              />
              <StatCard
                icon={TrendingDown}
                label="Total Kerugian"
                value={`Rp ${Number(summary?.total_kerugian || 0).toLocaleString("id-ID")}`}
                gradient="bg-[#F29C38]"
              />
            </>
          )}
        </div>

        {/* ── Charts + Activity Log ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          {/* Main Chart with Tabs */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <Tabs defaultValue="outlet">
              <TabsList variant="line" className="mb-4">
                <TabsTrigger value="outlet" className="text-sm">
                  Outlet
                </TabsTrigger>
                <TabsTrigger value="user" className="text-sm">
                  User
                </TabsTrigger>
              </TabsList>

              <TabsContent value="outlet">
                {graphLoading ? (
                  <div className="h-[300px] flex justify-center items-center"><Loader2 className="animate-spin text-blue-600 size-6" /></div>
                ) : (
                  <RevenueChart data={finalOutletGraphData} />
                )}
              </TabsContent>

              <TabsContent value="user">
                {graphLoading ? (
                  <div className="h-[300px] flex justify-center items-center"><Loader2 className="animate-spin text-blue-600 size-6" /></div>
                ) : (
                  <RevenueChart data={finalGraphData} />
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Activity Log */}
          {activityLoading ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-blue-600 size-6" />
            </div>
          ) : (
            <ActivityLog items={mappedActivities} />
          )}
        </div>

        {/* ── Bottom Row: Outlet Revenue (Customers is hidden) ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Customers Chart - HIDDEN TEMPORARILY AS NO BACKEND DATA EXISTS */}
          <div className="hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Customers</h3>
            {/* <CustomersChart data={[]} /> */}
          </div>

          {/* Outlet Revenue Bar Chart */}
          <div className="col-span-1 lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800">Pendapatan</h3>
              <p className="text-sm text-gray-400">Pendapatan per outlet</p>
            </div>
            {graphLoading ? (
               <div className="h-[300px] flex justify-center items-center"><Loader2 className="animate-spin text-blue-600 size-6" /></div>
            ) : realOutletRevenueData.length === 0 ? (
               <div className="h-[300px] flex justify-center items-center text-sm text-gray-400">Tidak ada data pendapatan outlet</div>
            ) : (
               <OutletRevenueChart data={realOutletRevenueData} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
