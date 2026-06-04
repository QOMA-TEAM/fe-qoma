import { SuperadminHeader } from "@/components/superadmin/header";
import { PendingTenantContent } from "@/components/superadmin/new-tenant/pending-tenant-content";

export default function NewTenantPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      <SuperadminHeader />
      <PendingTenantContent />
    </div>
  );
}