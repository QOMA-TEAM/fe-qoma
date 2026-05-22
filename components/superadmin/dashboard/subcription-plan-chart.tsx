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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
    <Card className="border border-gray-100 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-gray-800">
          Distribusi Subscription
        </CardTitle>
        <CardDescription className="text-xs text-gray-400 mt-0.5">
          Jumlah subscriber per plan
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {isLoading ? (
          <div className="h-48 flex items-center justify-center text-sm text-gray-400">
            Memuat data...
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-sm text-gray-400">
            Tidak ada data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
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
        )}

        {/* Legend */}
        {chartData.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-2">
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
      </CardContent>
    </Card>
  );
}
