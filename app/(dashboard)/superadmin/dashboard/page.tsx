import { SuperadminHeader } from "@/components/superadmin/header";
import { DashboardContent } from "@/components/superadmin/dashboard/dashboard-content";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <SuperadminHeader username="Super Admin" notificationCount={3} />

      {/* Page Content */}
      <DashboardContent />
    </div>
  );
}
