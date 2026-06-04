"use client";

import { RecentActivity } from "@/types/superadmin/dashboard";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
}

// ─── Activity Log Card ────────────────────────────────────────────────────────

interface ActivityLogProps {
  activities: RecentActivity[];
  isLoading?: boolean;
  className?: string;
}

export function ActivityLog({ activities, isLoading, className }: ActivityLogProps) {
  return (
    <div className={cn("bg-white rounded-2xl p-6 shadow-sm border border-[#F1F5F9] flex flex-col h-[400px]", className)}>
      <div className="mb-6">
        <h4 className="text-[#1E293B] font-bold text-lg">Activity Log</h4>
        <p className="text-[#44A5E6] text-sm font-medium">History</p>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-[#94A3B8]" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-10 text-sm text-[#94A3B8]">Belum ada aktivitas.</div>
        ) : (
          <div className="relative border-l-2 border-[#E2E8F0] ml-4 mt-2 space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="relative flex items-start pl-6 group">
                {/* Stepper Dot */}
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-[3px] border-[#F69C35]" />

                <div className="flex flex-col">
                  <span className="text-[#1E293B] font-bold text-sm leading-tight mb-1 capitalize">
                    {activity.aktivitas.replace(/_/g, ' ')}
                  </span>

                  <span className="text-[#44A5E6] text-xs font-semibold">
                    {formatTime(activity.created_at)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
