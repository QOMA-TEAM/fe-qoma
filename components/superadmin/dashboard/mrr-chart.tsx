"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MRRDataPoint,
  MRRFilter,
  MRRResponse,
} from "@/types/superadmin/dashboard";

// ─── Helpers ────────────────────────────────────────────────────────────────

const filterLabels: Record<MRRFilter, string> = {
  daily: "30 Hari Terakhir",
  weekly: "7 Hari Terakhir",
  monthly: "12 Bulan Terakhir",
};

function formatLabel(point: MRRDataPoint, filter: MRRFilter): string {
  if (filter === "monthly" && point.bulan) {
    const [year, month] = point.bulan.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleString("id-ID", { month: "short" });
  }
  if (point.tanggal) {
    const date = new Date(point.tanggal);
    if (filter === "weekly") {
      return date.toLocaleString("id-ID", { weekday: "short", day: "numeric" });
    }
    return date.toLocaleString("id-ID", { day: "numeric", month: "short" });
  }
  return "";
}

function formatRupiah(value: number): string {
  if (value >= 1_000_000_000)
    return `Rp ${(value / 1_000_000_000).toFixed(1)}M`;
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(0)}jt`;
  if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}rb`;
  return `Rp ${value}`;
}

// ─── Custom Tooltip ──────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }} className="text-xs">
          {entry.name === "total"
            ? `Pendapatan: ${formatRupiah(entry.value)}`
            : `Subscriber: ${entry.value}`}
        </p>
      ))}
    </div>
  );
}

// ─── Chart Variant ───────────────────────────────────────────────────────────

type ChartVariant = "usaha" | "tenant" | "user";

interface MRRChartProps {
  mrrData?: MRRResponse["data"];
  filter: MRRFilter;
  onFilterChange: (filter: MRRFilter) => void;
  isLoading?: boolean;
}

export function MRRChart({
  mrrData,
  filter,
  onFilterChange,
  isLoading,
}: MRRChartProps) {
  const chartData =
    mrrData?.data?.map((point) => ({
      label: formatLabel(point, filter),
      total: Number(point.total),
      jumlah_subscriber: point.jumlah_subscriber,
    })) ?? [];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F1F5F9] flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-[#1E293B] font-bold text-lg">
          {mrrData?.label ?? "Grafik MRR"}
        </h4>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-white border-[#E2E8F0] shadow-sm rounded-lg text-[#334155] font-medium w-[150px] justify-between text-xs h-8"
            >
              {filterLabels[filter]} <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px]">
            {Object.entries(filterLabels).map(([key, label]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => onFilterChange(key as MRRFilter)}
                className={cn(
                  "cursor-pointer text-xs",
                  filter === key && "font-semibold text-[#2C44B9]"
                )}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex-1 w-full relative">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#94A3B8]" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-[#94A3B8]">
            Tidak ada data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f0f0f0"
                opacity={0}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "#F97316" }}
                axisLine={false}
                tickLine={false}
                dy={10}
                minTickGap={20}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#F97316" }}
                axisLine={false}
                tickLine={false}
                dx={-5}
                tickFormatter={(v) => {
                  if (v >= 1000000) return `${(v / 1000000).toFixed(1).replace(/\.0$/, '')}M`
                  if (v >= 1000) return `${(v / 1000).toFixed(0)}K`
                  return v;
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#F97316"
                strokeWidth={2}
                fill="url(#mrrGradient)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#F97316",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
