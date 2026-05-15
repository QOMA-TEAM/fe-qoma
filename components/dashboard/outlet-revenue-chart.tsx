"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export interface OutletRevenueDataPoint {
  outlet: string
  pendapatan: number
  pengeluaran: number
}

interface OutletRevenueChartProps {
  data: OutletRevenueDataPoint[]
}

const chartConfig = {
  pendapatan: {
    label: "Pendapatan",
    color: "#2563EB",
  },
  pengeluaran: {
    label: "Pengeluaran",
    color: "#F97316",
  },
} satisfies ChartConfig

export function OutletRevenueChart({ data }: OutletRevenueChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f0f0f0"
        />
        <XAxis
          dataKey="outlet"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#9ca3af" }}
          dx={-5}
          tickFormatter={(value) => {
            if (value >= 1000) return `${value / 1000}K`
            return value.toString()
          }}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
        />
        <Bar
          dataKey="pendapatan"
          fill="var(--color-pendapatan)"
          radius={[4, 4, 0, 0]}
          barSize={18}
        />
        <Bar
          dataKey="pengeluaran"
          fill="var(--color-pengeluaran)"
          radius={[4, 4, 0, 0]}
          barSize={18}
        />
      </BarChart>
    </ChartContainer>
  )
}
