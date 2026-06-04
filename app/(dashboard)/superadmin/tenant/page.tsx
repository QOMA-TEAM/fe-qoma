import { SuperadminHeader } from "@/components/superadmin/header";
import { TenantContent } from "@/components/superadmin/tenant/tenant-content";

export default function DetailSubscriptionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      <SuperadminHeader />
      <TenantContent />
    </div>
  );
}