"use client"

import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
  gradient: string
  className?: string
}

export function StatCard({ icon: Icon, label, value, gradient, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 text-white shadow-sm",
        gradient,
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="bg-white/20 p-2 rounded-lg">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-sm font-medium opacity-90">{label}</span>
      </div>
      <h3 className="text-2xl font-bold relative z-10">{value}</h3>
      {/* Background Icon Decoration */}
      <Icon className="absolute -bottom-6 -right-4 w-32 h-32 text-white/10 pointer-events-none" />
    </div>
  )
}
