"use client"

import { Home, CircleDollarSign, TrendingDown, Settings, Bell } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatCard } from "@/components/dashboard/stat-card"
import { ActivityLog, type ActivityItem } from "@/components/dashboard/activity-log"
import { RevenueChart, type RevenueDataPoint } from "@/components/dashboard/revenue-chart"
import { CustomersChart, type CustomersDataPoint } from "@/components/dashboard/customers-chart"
import { OutletRevenueChart, type OutletRevenueDataPoint } from "@/components/dashboard/outlet-revenue-chart"

// ──────────────────────────────────────────────
// Dummy data — replace with API / database calls
// ──────────────────────────────────────────────

const statCards = {
  totalOutlet: 10,
  totalPendapatan: "Rp. 999.000.000",
  totalKerugian: "Rp. 200.000",
}

const revenueData: RevenueDataPoint[] = [
  { month: "Jul", revenue: 12 },
  { month: "Aug", revenue: 15 },
  { month: "Sep", revenue: 22 },
  { month: "Oct", revenue: 28 },
  { month: "Nov", revenue: 25 },
  { month: "Dec", revenue: 30 },
]

const revenueDataOutlet: RevenueDataPoint[] = [
  { month: "Jul", revenue: 8 },
  { month: "Aug", revenue: 12 },
  { month: "Sep", revenue: 18 },
  { month: "Oct", revenue: 24 },
  { month: "Nov", revenue: 20 },
  { month: "Dec", revenue: 26 },
]

const revenueDataUser: RevenueDataPoint[] = [
  { month: "Jul", revenue: 5 },
  { month: "Aug", revenue: 10 },
  { month: "Sep", revenue: 14 },
  { month: "Oct", revenue: 20 },
  { month: "Nov", revenue: 18 },
  { month: "Dec", revenue: 22 },
]

const customersData: CustomersDataPoint[] = [
  { month: "Jul", newCustomers: 50, returning: 30 },
  { month: "Aug", newCustomers: 55, returning: 40 },
  { month: "Sep", newCustomers: 65, returning: 55 },
  { month: "Oct", newCustomers: 72, returning: 60 },
  { month: "Nov", newCustomers: 80, returning: 70 },
  { month: "Dec", newCustomers: 95, returning: 82 },
]

const outletRevenueData: OutletRevenueDataPoint[] = [
  { outlet: "Outlet A", pendapatan: 28000, pengeluaran: 15000 },
  { outlet: "Outlet B", pendapatan: 22000, pengeluaran: 12000 },
  { outlet: "Outlet C", pendapatan: 30000, pengeluaran: 18000 },
  { outlet: "Outlet D", pendapatan: 18000, pengeluaran: 8000 },
  { outlet: "Outlet E", pendapatan: 25000, pengeluaran: 14000 },
]

const activityItems: ActivityItem[] = [
  { id: 1, title: "Penambahan Outlet", time: "10.30 AM" },
  { id: 2, title: "Penambahan Outlet", time: "9.20 AM" },
  { id: 3, title: "Penambahan Outlet", time: "9.20 AM" },
  { id: 4, title: "Penambahan Outlet", time: "9.20 AM" },
  { id: 5, title: "Penambahan Outlet", time: "9.20 AM" },
  { id: 6, title: "Penambahan Outlet", time: "9.20 AM" },
  { id: 7, title: "Penambahan Outlet", time: "9.20 AM" },
  { id: 8, title: "Penambahan Outlet", time: "9.20 AM" },
  { id: 9, title: "Penambahan Outlet", time: "9.20 AM" },
]

// ──────────────────────────────────────────────

export default function OwnerDashboardPage() {
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
          <StatCard
            icon={Home}
            label="Total Outlet"
            value={statCards.totalOutlet.toString()}
            gradient="bg-gradient-to-br from-blue-500 to-blue-700"
          />
          <StatCard
            icon={CircleDollarSign}
            label="Total Pendapatan"
            value={statCards.totalPendapatan}
            gradient="bg-gradient-to-br from-blue-400 to-blue-600"
          />
          <StatCard
            icon={TrendingDown}
            label="Total Kerugian"
            value={statCards.totalKerugian}
            gradient="bg-gradient-to-br from-orange-400 to-orange-600"
          />
        </div>

        {/* ── Charts + Activity Log ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          {/* Revenue Chart with Tabs */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <Tabs defaultValue="usaha">
              <TabsList variant="line" className="mb-4">
                <TabsTrigger value="usaha" className="text-sm">
                  User
                </TabsTrigger>
                <TabsTrigger value="outlet" className="text-sm">
                  Outlet
                </TabsTrigger>
                <TabsTrigger value="user" className="text-sm">
                  Usaha
                </TabsTrigger>
              </TabsList>

              <TabsContent value="usaha">
                <RevenueChart data={revenueData} />
              </TabsContent>
              <TabsContent value="outlet">
                <RevenueChart data={revenueDataOutlet} />
              </TabsContent>
              <TabsContent value="user">
                <RevenueChart data={revenueDataUser} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Activity Log */}
          <ActivityLog items={activityItems} />
        </div>

        {/* ── Bottom Row: Customers + Outlet Revenue ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Customers Chart */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Customers</h3>
            <CustomersChart data={customersData} />
          </div>

          {/* Outlet Revenue Bar Chart */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800">Pendapatan</h3>
              <p className="text-sm text-gray-400">Pendapatan per outlet</p>
            </div>
            <OutletRevenueChart data={outletRevenueData} />
          </div>
        </div>
      </main>
    </div>
  )
}
