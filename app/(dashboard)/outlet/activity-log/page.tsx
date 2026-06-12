import { Metadata } from "next";
import { ActivityLogContent } from "@/components/outlet/activity-log/activity-log-content";

export const metadata: Metadata = {
  title: "Activity Log | QOMA Outlet",
  description: "Riwayat aktivitas outlet",
};

export default function ActivityLogOutletPage() {
  return (
    <div className="flex flex-col flex-1 overflow-auto bg-gray-50/40">
      <ActivityLogContent />
    </div>
  );
}
