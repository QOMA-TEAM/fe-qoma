"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecentActivity } from "@/types/superadmin/dashboard";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "";
  }
}

function formatRelative(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), {
      addSuffix: true,
      locale: id,
    });
  } catch {
    return "";
  }
}

// ─── Activity Item ───────────────────────────────────────────────────────────

interface ActivityItemProps {
  index: number;
  activity: RecentActivity;
}

function ActivityItem({ index, activity }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      {/* Number Badge */}
      <div
        className={cn(
          "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold",
          "bg-orange-50 text-orange-500",
        )}
      >
        {index}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {activity.aktivitas}
        </p>
        {activity.deskripsi && (
          <p className="text-xs text-gray-400 truncate mt-0.5">
            {activity.deskripsi}
          </p>
        )}
        <p className="text-xs text-orange-400 mt-0.5">
          {formatTime(activity.created_at)}
        </p>
      </div>
    </div>
  );
}

// ─── Activity Log Card ────────────────────────────────────────────────────────

interface ActivityLogProps {
  activities: RecentActivity[];
  isLoading?: boolean;
}

export function ActivityLog({ activities, isLoading }: ActivityLogProps) {
  return (
    <Card className="border border-gray-100 shadow-sm h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-gray-800">
          Activity Log
        </CardTitle>
        <CardDescription className="text-xs text-orange-400 font-medium mt-0">
          History
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-sm text-gray-400">
            Memuat aktivitas...
          </div>
        ) : activities.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-sm text-gray-400">
            Belum ada aktivitas
          </div>
        ) : (
          <ScrollArea className="h-[420px] pr-3">
            {activities.map((activity, idx) => (
              <ActivityItem
                key={activity.id}
                index={idx + 1}
                activity={activity}
              />
            ))}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
