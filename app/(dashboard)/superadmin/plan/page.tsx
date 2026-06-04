import { SuperadminHeader } from "@/components/superadmin/header";
import { PlanContent } from "@/components/superadmin/plan/plan-content";

export default function ManagementPlanPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      <SuperadminHeader />
      <PlanContent />
    </div>
  );
}
