"use client";

import { useOutletDashboard, useToggleOutletStatus } from "@/hooks/outlet/use-dashboard";
import { HeaderActions } from "@/components/dashboard/header-actions";
import { IncomingOrders } from "@/components/outlet/dashboard/incoming-orders";
import { OutletStatCards } from "@/components/outlet/dashboard/stat-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { CustomersChart } from "@/components/dashboard/customers-chart";
import { NotificationFeed } from "@/components/outlet/dashboard/notification-feed";
import { Loader2, Store } from "lucide-react";

export function OutletDashboardContent() {
  const { data: response, isLoading, isError } = useOutletDashboard();
  const { mutate: toggleStatus, isPending } = useToggleOutletStatus();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !response) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="text-center text-red-500 font-medium">Gagal memuat data dashboard</div>
      </div>
    );
  }

  const { outlet, keuangan_7_hari, alert_summary, grafik_pendapatan, alerts } = response.data;

  // Format the chart data from the backend
  const chartData = grafik_pendapatan?.map((item) => {
    const date = new Date(item.periode);
    // e.g., "05 Jun"
    const formattedDate = date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short"
    });
    
    return {
      month: formattedDate,
      revenue: item.total_pendapatan
    };
  }) || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Top Header Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <h2 className="text-[#1E293B] text-[15px] font-bold">
          Welcome back, {outlet.nama_outlet || "Outlet"}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleStatus()}
            disabled={isLoading || isPending}
            className={`flex items-center justify-center size-9 rounded-full border border-gray-200 transition-colors cursor-pointer ${outlet.status_buka
                ? "bg-green-50 text-green-600 hover:bg-green-100"
                : "bg-red-50 text-red-500 hover:bg-red-100"
              }`}
            title={outlet.status_buka ? "Outlet Sedang Buka (Klik untuk Tutup)" : "Outlet Sedang Tutup (Klik untuk Buka)"}
            aria-label="Toggle outlet status"
          >
            {isPending ? <Loader2 className="size-4 animate-spin" /> : <Store className="size-4" />}
          </button>
          <HeaderActions />
        </div>
      </header>

      <main className="flex-1 overflow-auto p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-[28px] font-bold text-[#1E293B]">Dashboard</h1>
        </div>

        {/* Pesanan Datang Section */}
        <IncomingOrders />

        {/* For Your Information Section (Keuangan) */}
        <OutletStatCards keuangan={keuangan_7_hari} />

        {/* Bottom Section: Charts & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {/* Revenue Chart */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col h-[400px]">
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900">Pendapatan</h3>
                <p className="text-xs text-gray-500">Pendapatan 7 Hari Terakhir</p>
              </div>
              <div className="flex-1 min-h-0">
                <RevenueChart data={chartData} />
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            {/* Notification Feed using alerts */}
            <NotificationFeed alerts={alerts} />
          </div>
        </div>
      </main>
    </div>
  );
}
