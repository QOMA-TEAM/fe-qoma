"use client";

import { Building2, Users, DollarSign, TrendingUp } from "lucide-react";
import { DashboardRingkasan } from "@/types/superadmin/dashboard";
import { StatCard } from "@/components/dashboard/stat-card";

function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("IDR", "Rp.");
}

interface DashboardStatsCardsProps {
  ringkasan: DashboardRingkasan;
}

export function DashboardStatsCards({ ringkasan }: DashboardStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <StatCard
        icon={Building2}
        label="Total Usaha"
        value={ringkasan.total_usaha.toString()}
        gradient="bg-[#2D45B8]"
        className="h-[160px] flex flex-col justify-between"
      />
      <StatCard
        icon={Users}
        label="Total Tenant"
        value={ringkasan.total_outlet.toString()}
        gradient="bg-[#44A5E6]"
        className="h-[160px] flex flex-col justify-between"
      />
      <StatCard
        icon={DollarSign}
        label="Total Pendapatan"
        value={formatRupiah(ringkasan.total_pendapatan_subscription)}
        gradient="bg-[#F69C35]"
        className="h-[160px] flex flex-col justify-between"
      />
      <StatCard
        icon={TrendingUp}
        label="Pendapatan Bulanan"
        value={formatRupiah(ringkasan.total_pendapatan_bulan_ini)}
        gradient="bg-[#10B981]" // using emerald for positive trend
        className="h-[160px] flex flex-col justify-between"
      />
    </div>
  );
}
