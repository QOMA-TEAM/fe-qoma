"use client"

import {
  Area,
  AreaChart,
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

export interface RevenueDataPoint {
  month: string
  revenue: number
}

interface RevenueChartProps {
  data: RevenueDataPoint[]
}

const chartConfig = {
  revenue: {
    label: "Pendapatan",
    color: "#F97316",
  },
} satisfies ChartConfig

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#F97316" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f0f0f0"
        />
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#9ca3af" }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#9ca3af" }}
          dx={-5}
        />
        <ChartTooltip
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#F97316"
          strokeWidth={2.5}
          fill="url(#revenueGradient)"
          dot={false}
          activeDot={{
            r: 5,
            fill: "#F97316",
            stroke: "#fff",
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ChartContainer>
  )
}
