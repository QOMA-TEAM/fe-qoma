"use client";

import { useOutletDashboard, useToggleOutletStatus } from "@/hooks/outlet/use-dashboard";
import { HeaderActions } from "@/components/dashboard/header-actions";
import { IncomingOrders } from "@/components/outlet/dashboard/incoming-orders";
import { OutletStatCards } from "@/components/outlet/dashboard/stat-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { CustomersChart } from "@/components/dashboard/customers-chart";
import { NotificationFeed } from "@/components/outlet/dashboard/notification-feed";
import { Loader2, Store, Settings, Bell } from "lucide-react";
import { useState } from "react";
import { ChangePasswordDialog } from "@/components/settings/change-password-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function OutletDashboardContent() {
  const { data: response, isLoading, isError } = useOutletDashboard();
  const { mutate: toggleStatus, isPending } = useToggleOutletStatus();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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

  // Map alerts to notification format
  const flattenedAlerts = [
    ...(alerts?.sudah_expired?.map((a: any) => ({ ...a, type: 'sudah_expired' })) || []),
    ...(alerts?.mendekati_expired?.map((a: any) => ({ ...a, type: 'mendekati_expired' })) || []),
    ...(alerts?.stok_menipis?.map((a: any) => ({ ...a, type: 'stok_menipis' })) || [])
  ];

  const extraNotifications = flattenedAlerts.map((alert, idx) => ({
    id: `alert-${idx}`,
    title: alert.type === 'stok_menipis' ? 'Peringatan Stok' : 'Peringatan Kedaluwarsa',
    message: alert.pesan,
    is_read: false,
    created_at: new Date().toISOString(),
    type: alert.type,
  }));

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
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center justify-center size-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Settings"
          >
            <Settings className="size-4" />
          </button>

          <HeaderActions extraNotifications={extraNotifications} />
        </div>
      </header>

      <ChangePasswordDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base font-semibold">Status Outlet</Label>
            <p className="text-sm text-gray-500">
              {outlet.status_buka ? "Outlet saat ini sedang Buka" : "Outlet saat ini sedang Tutup"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={outlet.status_buka}
              onCheckedChange={() => toggleStatus()}
              aria-label="Toggle outlet status"
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
            />
          </div>
        </div>
      </ChangePasswordDialog>

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
