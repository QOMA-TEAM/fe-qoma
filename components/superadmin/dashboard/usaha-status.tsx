"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Loader2 } from "lucide-react";
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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F1F5F9] flex flex-col h-[400px]">
      <div className="mb-6">
        <h4 className="text-[#1E293B] font-bold text-lg">Status Usaha</h4>
        <p className="text-[#64748B] text-sm font-medium mt-1">Distribusi berdasarkan status</p>
      </div>

      <div className="flex-1 w-full relative flex items-center justify-center">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#94A3B8]" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 w-full">
            {/* Donut Chart */}
            <div className="relative flex-shrink-0 w-[180px] h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
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
                <span className="text-2xl font-bold text-gray-800">{total}</span>
                <span className="text-xs text-gray-400">Total</span>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full grid grid-cols-2 gap-3 mt-4">
              {chartData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-2 bg-gray-50/50 px-3 py-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-medium text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-800">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
