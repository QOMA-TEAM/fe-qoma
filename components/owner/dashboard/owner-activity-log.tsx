"use client"

import { Loader2 } from "lucide-react"
import { useActivityLog } from "@/hooks/owner/use-dashboard"

export function OwnerActivityLog() {
  const { data: activityResponse, isLoading: activityLoading } = useActivityLog(1, 15)
  const activities = activityResponse?.data || []

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F1F5F9] flex flex-col h-[400px]">
      <div className="mb-6">
        <h4 className="text-[#1E293B] font-bold text-lg">Activity Log</h4>
        <p className="text-[#44A5E6] text-sm font-medium">History</p>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 pb-4">
        {activityLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-[#94A3B8]" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-10 text-sm text-[#94A3B8]">Belum ada aktivitas.</div>
        ) : (
          <div className="relative border-l-2 border-[#E2E8F0] ml-4 mt-2 space-y-6">
            {activities.map((item) => {
              const date = new Date(item.created_at)
              const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
              
              return (
                <div key={item.id} className="relative flex items-start pl-6">
                  {/* Stepper Dot */}
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-[3px] border-[#F69C35]" />
                  
                  <div className="flex flex-col">
                    <span className="text-[#1E293B] font-bold text-sm leading-tight mb-1 capitalize">{item.aktivitas.replace(/_/g, ' ')}</span>
                    <span className="text-[#44A5E6] text-xs font-semibold">{timeString}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
