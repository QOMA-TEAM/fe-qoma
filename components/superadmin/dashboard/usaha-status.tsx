"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { UsahaByStatus } from "@/types/superadmin/dashboard";

const STATUS_CONFIG: Record<
  keyof UsahaByStatus,
  { label: string; color: string }
> = {
  active: { label: "Aktif", color: "#16a34a" },
  pending: { label: "Pending", color: "#f97316" },
  suspended: { label: "Suspended", color: "#ef4444" },
  rejected: { label: "Ditolak", color: "#9ca3af" },
};

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const { name, value, fill } = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm">
      <span style={{ color: fill }} className="font-semibold">
        {name}
      </span>
      <span className="text-gray-600 ml-2">{value} usaha</span>
    </div>
  );
}

interface UsahaStatusChartProps {
  status: UsahaByStatus;
  isLoading?: boolean;
}

export function UsahaStatusChart({ status, isLoading }: UsahaStatusChartProps) {
  const total = Object.values(status).reduce((a, b) => a + b, 0);

  const chartData = (Object.keys(STATUS_CONFIG) as (keyof UsahaByStatus)[]).map(
    (key) => ({
      name: STATUS_CONFIG[key].label,
      value: status[key],
      color: STATUS_CONFIG[key].color,
    }),
  );

  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-gray-800">
          Status Usaha
        </CardTitle>
        <CardDescription className="text-xs text-gray-400 mt-0.5">
          Distribusi berdasarkan status
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {isLoading ? (
          <div className="h-48 flex items-center justify-center text-sm text-gray-400">
            Memuat data...
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {/* Donut Chart */}
            <div className="relative flex-shrink-0">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={42}
                    outerRadius={62}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-gray-800">{total}</span>
                <span className="text-[10px] text-gray-400">Total</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 flex-1">
              {chartData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-800">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
