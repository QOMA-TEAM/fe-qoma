"use client";

import { useEffect, useState } from "react";
import { SuperadminHeader } from "@/components/superadmin/header";
import { DashboardStatsCards } from "@/components/superadmin/dashboard/stat-card";
import { MRRChart } from "@/components/superadmin/dashboard/mrr-chart";
import { ActivityLog } from "@/components/superadmin/dashboard/activity-log";
import { PendingApprovals } from "@/components/superadmin/dashboard/pending-approval";
import { SubscriptionPlanChart } from "@/components/superadmin/dashboard/subcription-plan-chart";
import { UsahaStatusChart } from "@/components/superadmin/dashboard/usaha-status";
import { dashboardService } from "@/hooks/superadmin/use-dashboard";
import {
  DashboardStatsResponse,
  MRRFilter,
  MRRResponse,
} from "@/types/superadmin/dashboard";
import { toast } from "sonner";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStatsResponse["data"] | null>(
    null,
  );
  const [mrr, setMrr] = useState<MRRResponse["data"] | null>(null);
  const [mrrFilter, setMrrFilter] = useState<MRRFilter>("monthly");
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingMrr, setLoadingMrr] = useState(true);

  // ─── Fetch Stats ────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      setLoadingStats(true);
      try {
        const res: DashboardStatsResponse = await dashboardService.getStats();
        setStats(res.data);
      } catch (err) {
        toast.error("Gagal memuat data dashboard");
      } finally {
        setLoadingStats(false);
      }
    };
    fetch();
  }, []);

  // ─── Fetch MRR ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      setLoadingMrr(true);
      try {
        const res: MRRResponse = await dashboardService.getMRR(mrrFilter);
        setMrr(res.data);
      } catch (err) {
        toast.error("Gagal memuat data MRR");
      } finally {
        setLoadingMrr(false);
      }
    };
    fetch();
  }, [mrrFilter]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      {/* Header */}
      <SuperadminHeader username="Super Admin" notificationCount={3} />

      {/* Page Content */}
      <main className="flex-1 px-6 py-6 space-y-6 max-w-screen-2xl mx-auto w-full">
        {/* Page Title */}
        <div>
          <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Ringkasan aktivitas bisnis Anda
          </p>
        </div>

        {/* Stats Cards */}
        <DashboardStatsCards
          ringkasan={
            stats?.ringkasan ?? {
              total_usaha: 0,
              total_outlet: 0,
              total_pendapatan_subscription: 0,
              total_pendapatan_bulan_ini: 0,
              total_owner: 0,
            }
          }
        />

        {/* MRR Chart (Full width) */}
        <MRRChart
          mrrData={mrr ?? undefined}
          filter={mrrFilter}
          onFilterChange={setMrrFilter}
          isLoading={loadingMrr}
        />

        {/* Bottom Grid: 2 Charts + Activity Log */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Side: Subscription + Status (2 cols) */}
          <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <SubscriptionPlanChart
              plans={stats?.subscription_by_plan ?? []}
              isLoading={loadingStats}
            />
            <UsahaStatusChart
              status={
                stats?.usaha_by_status ?? {
                  active: 0,
                  pending: 0,
                  suspended: 0,
                  rejected: 0,
                }
              }
              isLoading={loadingStats}
            />
          </div>

          {/* Right Side: Activity Log (1 col) */}
          <div className="xl:col-span-1">
            <ActivityLog
              activities={stats?.recent_activities ?? []}
              isLoading={loadingStats}
            />
          </div>
        </div>

        {/* Pending Approvals */}
        <PendingApprovals
          approvals={stats?.pending_approvals ?? []}
          isLoading={loadingStats}
          onApprove={(id) => toast.success(`Usaha ${id} disetujui`)}
          onReject={(id) => toast.error(`Usaha ${id} ditolak`)}
        />
      </main>
    </div>
  );
}
