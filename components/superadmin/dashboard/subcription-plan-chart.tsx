"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Loader2 } from "lucide-react";
import { SubscriptionByPlan } from "@/types/superadmin/dashboard";

const COLORS = ["#1d4ed8", "#16a34a", "#38bdf8", "#f97316", "#8b5cf6"];

function formatRupiah(value: number): string {
  if (value >= 1_000_000_000)
    return `Rp ${(value / 1_000_000_000).toFixed(1)}M`;
  if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(0)}jt`;
  return `Rp ${value}`;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p
          key={entry.dataKey}
          style={{ color: entry.fill }}
          className="text-xs"
        >
          {entry.dataKey === "total"
            ? `Subscriber: ${entry.value}`
            : `Pendapatan: ${formatRupiah(Number(entry.value))}`}
        </p>
      ))}
    </div>
  );
}

interface SubscriptionPlanChartProps {
  plans: SubscriptionByPlan[];
  isLoading?: boolean;
}

export function SubscriptionPlanChart({
  plans,
  isLoading,
}: SubscriptionPlanChartProps) {
  const chartData = plans.map((plan, i) => ({
    name: plan.nama_plan,
    total: plan.total,
    pendapatan: Number(plan.pendapatan),
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F1F5F9] flex flex-col h-[400px]">
      <div className="mb-6">
        <h4 className="text-[#1E293B] font-bold text-lg">Distribusi Subscription</h4>
        <p className="text-[#64748B] text-sm font-medium mt-1">Jumlah subscriber per plan</p>
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
          <div className="h-full flex flex-col">
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 0, left: -20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9ca3af" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            {chartData.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                {chartData.map((plan) => (
                  <div
                    key={plan.name}
                    className="flex items-center gap-1.5 text-xs text-gray-500"
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: plan.color }}
                    />
                    <span>{plan.name}</span>
                    <span className="text-gray-400">({plan.total})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
