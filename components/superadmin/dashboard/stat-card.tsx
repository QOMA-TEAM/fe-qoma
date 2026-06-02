"use client";

import { Building2, Users, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardRingkasan } from "@/types/owner/dashboard";
import { cn } from "@/lib/utils";

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

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bgClassName: string;
  decorIcon: React.ReactNode;
}

function StatCard({
  label,
  value,
  icon,
  bgClassName,
  decorIcon,
}: StatCardProps) {
  return (
    <Card
      className={cn("relative overflow-hidden border-0 shadow-sm", bgClassName)}
    >
      <CardContent className="p-6">
        {/* Icon top-left */}
        <div className="flex items-center gap-2 mb-4">
          <div className="text-white opacity-90">{icon}</div>
          <span className="text-white text-sm font-medium opacity-90">
            {label}
          </span>
        </div>

        {/* Value */}
        <p className="text-white text-2xl font-bold tracking-tight">{value}</p>

        {/* Decorative background icon */}
        <div className="absolute right-4 bottom-4 text-white opacity-20 pointer-events-none">
          {decorIcon}
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardStatsCardsProps {
  ringkasan: DashboardRingkasan;
}

export function DashboardStatsCards({ ringkasan }: DashboardStatsCardsProps) {
  const cards: StatCardProps[] = [
    {
      label: "Total Usaha",
      value: ringkasan.total_usaha,
      icon: <Building2 className="h-5 w-5" />,
      bgClassName: "bg-blue-700",
      decorIcon: <DollarSign className="h-20 w-20" />,
    },
    {
      label: "Total Tenant",
      value: ringkasan.total_outlet,
      icon: <Users className="h-5 w-5" />,
      bgClassName: "bg-green-600",
      decorIcon: <TrendingUp className="h-20 w-20" />,
    },
    {
      label: "Total Pendapatan",
      value: formatRupiah(ringkasan.total_pendapatan_subscription),
      icon: <DollarSign className="h-5 w-5" />,
      bgClassName: "bg-sky-400",
      decorIcon: <DollarSign className="h-20 w-20" />,
    },
    {
      label: "Pendapatan Bulanan",
      value: formatRupiah(ringkasan.total_pendapatan_bulan_ini),
      icon: <TrendingUp className="h-5 w-5" />,
      bgClassName: "bg-orange-400",
      decorIcon: <TrendingUp className="h-20 w-20" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
