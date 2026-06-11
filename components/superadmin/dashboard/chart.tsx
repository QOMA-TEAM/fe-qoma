"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

function formatLabel(item: any) {
  // monthly pakai `bulan`, daily/weekly pakai `tanggal`
  return item.bulan ?? item.tanggal ?? "";
}

export default function UsahaChart({
  mrrData = [],
  filter,
  onFilter,
  loading = false,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <Tabs defaultValue="usaha" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList className="bg-transparent p-0 gap-4">
              <TabsTrigger
                value="usaha"
                className="text-sm font-medium px-0 pb-2 rounded-none data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-gray-800 data-[state=inactive]:text-gray-400"
              >
                Usaha
              </TabsTrigger>
              <TabsTrigger
                value="tenant"
                className="text-sm font-medium px-0 pb-2 rounded-none data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-gray-800 data-[state=inactive]:text-gray-400"
              >
                Tenant
              </TabsTrigger>
              <TabsTrigger
                value="user"
                className="text-sm font-medium px-0 pb-2 rounded-none data-[state=active]:text-gray-900 data-[state=active]:border-b-2 data-[state=active]:border-gray-800 data-[state=inactive]:text-gray-400"
              >
                User
              </TabsTrigger>
            </TabsList>

            {/* Filter button group */}
            <div className="flex gap-1 text-xs">
              {["daily", "weekly", "monthly"].map((f) => (
                <button
                  key={f}
                  onClick={() => onFilter(f)}
                  className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                    filter === f
                      ? "bg-amber-400 text-white font-semibold"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {f === "daily"
                    ? "Harian"
                    : f === "weekly"
                      ? "Mingguan"
                      : "Bulanan"}
                </button>
              ))}
            </div>
          </div>

          <TabsContent value="usaha" className="mt-4">
            <ChartBody
              data={mrrData}
              dataKey="jumlah_subscriber"
              loading={loading}
            />
          </TabsContent>
          <TabsContent value="tenant" className="mt-4">
            <ChartBody
              data={mrrData}
              dataKey="jumlah_subscriber"
              loading={loading}
            />
          </TabsContent>
          <TabsContent value="user" className="mt-4">
            <ChartBody
              data={mrrData}
              dataKey="jumlah_subscriber"
              loading={loading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ChartBody({ data, dataKey, loading }) {
  if (loading) return <Skeleton className="h-52 w-full rounded-xl" />;

  const chartData = data.map((item) => ({
    label: item.bulan ?? item.tanggal ?? "",
    value: Number(item[dataKey] ?? 0),
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f0f0f0"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => {
            // Untuk format bulan: '2024-07' → 'Jul'
            if (v && v.includes("-") && v.length === 7) {
              return new Date(v + "-01").toLocaleDateString("en-US", {
                month: "short",
              });
            }
            return v;
          }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "10px",
            border: "1px solid #f0f0f0",
            fontSize: "12px",
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#F59E0B"
          strokeWidth={2.5}
          dot={false}
          activeDot={{ r: 5, fill: "#F59E0B" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
