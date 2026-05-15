"use client"

import { cn } from "@/lib/utils"

export interface ActivityItem {
  id: number
  title: string
  time: string
}

interface ActivityLogProps {
  items: ActivityItem[]
  className?: string
}

export function ActivityLog({ items, className }: ActivityLogProps) {
  const getBadgeColor = (index: number) => {
    const colors = [
      "bg-orange-500 text-white",
      "bg-blue-500 text-white",
      "bg-emerald-500 text-white",
      "bg-violet-500 text-white",
      "bg-pink-500 text-white",
      "bg-amber-500 text-white",
      "bg-cyan-500 text-white",
      "bg-rose-500 text-white",
      "bg-teal-500 text-white",
    ]
    return colors[index % colors.length]
  }

  return (
    <div className={cn("rounded-2xl border border-gray-100 bg-white p-6 shadow-sm", className)}>
      <div className="mb-5">
        <h3 className="text-lg font-bold text-gray-800">Activity Log</h3>
        <p className="text-sm font-medium text-gray-400/80">History</p>
      </div>

      <div className="space-y-1 max-h-[440px] overflow-y-auto pr-1 custom-scrollbar">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-gray-50/80 transition-colors group"
          >
            <div
              className={cn(
                "flex items-center justify-center size-8 rounded-full text-xs font-bold shrink-0 shadow-sm transition-transform group-hover:scale-110",
                getBadgeColor(index)
              )}
            >
              {item.id}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-700 truncate">{item.title}</p>
              <p className="text-xs text-gray-400">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
