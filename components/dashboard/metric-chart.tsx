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

export interface MetricDataPoint {
  label: string
  value: number
}

interface MetricChartProps {
  data: MetricDataPoint[]
  labelName: string
  color?: string
}

export function MetricChart({ data, labelName, color = "#F97316" }: MetricChartProps) {
  const chartConfig = {
    value: {
      label: labelName,
      color: color,
    },
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id={`gradient-${labelName}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.1} />
            <stop offset="95%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f0f0f0"
          opacity={0} // Hide grid based on image reference, mostly clean
        />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#F97316" }} // Orange ticks per image
          dy={10}
          minTickGap={20}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12, fill: "#F97316" }} // Orange ticks per image
          dx={-5}
          tickFormatter={(value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1).replace(/\.0$/, '')}M`
            if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
            return value
          }}
        />
        <ChartTooltip
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#gradient-${labelName})`}
          dot={false}
          activeDot={{
            r: 4,
            fill: color,
            stroke: "#fff",
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ChartContainer>
  )
}
