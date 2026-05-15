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
        "relative overflow-hidden rounded-2xl p-6 text-white shadow-lg transition-transform duration-200 hover:scale-[1.02] hover:shadow-xl",
        gradient,
        className
      )}
    >
      {/* Background decorative circles */}
      <div className="absolute -right-4 -top-4 size-24 rounded-full bg-white/10" />
      <div className="absolute -right-2 -top-2 size-16 rounded-full bg-white/5" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center size-10 rounded-xl bg-white/20 backdrop-blur-sm">
            <Icon className="size-5" />
          </div>
          <span className="text-sm font-medium text-white/90">{label}</span>
        </div>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
      </div>
    </div>
  )
}
