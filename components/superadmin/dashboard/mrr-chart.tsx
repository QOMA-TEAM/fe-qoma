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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MRRDataPoint,
  MRRFilter,
  MRRResponse,
} from "@/types/superadmin/dashboard";

// ─── Helpers ────────────────────────────────────────────────────────────────

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
  const [variant, setVariant] = useState<ChartVariant>("usaha");

  const chartData =
    mrrData?.data?.map((point) => ({
      label: formatLabel(point, filter),
      total: Number(point.total),
      jumlah_subscriber: point.jumlah_subscriber,
    })) ?? [];

  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold text-gray-800">
              {mrrData?.label ?? "Grafik MRR"}
            </CardTitle>
            <CardDescription className="text-xs text-gray-400 mt-0.5">
              Data pendapatan berulang per periode
            </CardDescription>
          </div>

            {/* Filter Select */}
            <Select
              value={filter}
              onValueChange={(v) => onFilterChange(v as MRRFilter)}
            >
              <SelectTrigger className="h-8 w-36 text-xs border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily" className="text-xs">
                  30 Hari Terakhir
                </SelectItem>
                <SelectItem value="weekly" className="text-xs">
                  7 Hari Terakhir
                </SelectItem>
                <SelectItem value="monthly" className="text-xs">
                  12 Bulan Terakhir
                </SelectItem>
              </SelectContent>
            </Select>
        </div>
      </CardHeader>

      <CardContent className="pt-0 pb-4">
        {isLoading ? (
          <div className="h-52 flex items-center justify-center text-sm text-gray-400">
            Memuat data...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-52 flex items-center justify-center text-sm text-gray-400">
            Tidak ada data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 0, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "#f97316" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#f97316" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatRupiah(v)}
                width={55}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#mrrGradient)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#f97316",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card >
  );
}
