"use client";

import { useState } from "react";
import { SuperadminHeader } from "@/components/superadmin/header";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PendingTenantTable } from "@/components/superadmin/new-tenant/pending-tenant-table";
import { DetailTenantDialog } from "@/components/superadmin/tenant/detail-tenant-dialog";
import { RejectTenantDialog } from "@/components/superadmin/new-tenant/reject-tenant-dialog";
import { useTenant } from "@/hooks/superadmin/use-tenant";
import type { Tenant } from "@/types/superadmin/tenant";

export default function NewTenantPage() {
  const { tenants, loading, approveTenant, rejectTenant } = useTenant({ status: "pending" });
  
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [tenantToReject, setTenantToReject] = useState<Tenant | null>(null);

  const handleApprove = async (tenant: Tenant) => {
    if (window.confirm(`Apakah Anda yakin ingin menyetujui pendaftaran tenant ${tenant.nama_usaha}?`)) {
      await approveTenant(tenant.id);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <SuperadminHeader />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <span className="text-muted-foreground text-sm">
              Management Subscription
            </span>
          </BreadcrumbItem>

          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>New Tenant</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Content */}
      <div className="p-8">
        <PendingTenantTable
          tenants={tenants}
          loading={loading}
          onView={(tenant) => setSelectedTenant(tenant)}
          onApprove={handleApprove}
          onReject={(tenant) => setTenantToReject(tenant)}
        />
      </div>

      {/* Detail Dialog (Using the exact same detail dialog from components/superadmin/tenant) */}
      <DetailTenantDialog
        tenant={selectedTenant}
        onClose={() => setSelectedTenant(null)}
      />

      {/* Reject Dialog */}
      <RejectTenantDialog
        tenant={tenantToReject}
        open={!!tenantToReject}
        onOpenChange={(open) => {
          if (!open) setTenantToReject(null);
        }}
        onConfirm={rejectTenant}
      />
    </div>
  );
}
