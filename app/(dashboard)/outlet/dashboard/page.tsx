"use client"

import { useProfile } from "@/hooks/use-auth"
import { HeaderActions } from "@/components/dashboard/header-actions"
import { IncomingOrders } from "@/components/outlet/dashboard/incoming-orders"
import { OutletStatCards } from "@/components/outlet/dashboard/stat-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { CustomersChart } from "@/components/dashboard/customers-chart"
import { NotificationFeed } from "@/components/outlet/dashboard/notification-feed"

const dummyCustomersData = [
  { month: "Jan", newCustomers: 1200, returning: 800 },
  { month: "Feb", newCustomers: 1500, returning: 900 },
  { month: "Mar", newCustomers: 1100, returning: 1000 },
  { month: "Apr", newCustomers: 1800, returning: 1200 },
  { month: "May", newCustomers: 2200, returning: 1420 },
]

const dummyRevenueData = [
  { month: "1", revenue: 18000 },
  { month: "2", revenue: 30000 },
  { month: "3", revenue: 22000 },
  { month: "4", revenue: 31000 },
  { month: "5", revenue: 13000 },
]

export default function OutletDashboardPage() {
  const { data: profile } = useProfile()

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Top Header Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <h2 className="text-[#1E293B] text-[15px] font-bold">
          Welcome back, {profile?.username || 'Outlet'}
        </h2>
        <HeaderActions />
      </header>

      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-[#1E293B]">Dashboard</h1>
        </div>

        {/* Pesanan Datang Section */}
        <IncomingOrders />

        {/* For Your Information Section */}
        <OutletStatCards />

        {/* Bottom Section: Charts & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900">Pendapatan</h3>
                  <p className="text-xs text-gray-500">Pendapatan per Minggu</p>
                </div>
                <div className="flex-1 min-h-[250px]">
                  <RevenueChart data={dummyRevenueData} />
                </div>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900">Customers</h3>
                </div>
                <div className="flex-1 min-h-[250px]">
                  <CustomersChart data={dummyCustomersData} />
                </div>
                <div className="flex items-center justify-center gap-12 mt-4 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">34,249</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
                      <p className="text-xs text-gray-500 font-medium">New Customers</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">1420</p>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                      <p className="text-xs text-gray-500 font-medium">Repeated</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <NotificationFeed />
          </div>
        </div>
      </div>
    </div>
  )
}
