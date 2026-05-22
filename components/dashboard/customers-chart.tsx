"use client"

import {
  Line,
  LineChart,
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

export interface CustomersDataPoint {
  month: string
  newCustomers: number
  returning: number
}

interface CustomersChartProps {
  data: CustomersDataPoint[]
}

const chartConfig = {
  newCustomers: {
    label: "New Customers",
    color: "#2563EB",
  },
  returning: {
    label: "Returning",
    color: "#10B981",
  },
} satisfies ChartConfig

export function CustomersChart({ data }: CustomersChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
          content={<ChartTooltipContent />}
        />
        <Line
          type="monotone"
          dataKey="newCustomers"
          stroke="var(--color-newCustomers)"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#2563EB", stroke: "#fff", strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="returning"
          stroke="var(--color-returning)"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#10B981", stroke: "#fff", strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ChartContainer>
  )
}
