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
import { TenantTable } from "@/components/superadmin/tenant/tenant-table";
import { DetailTenantDialog } from "@/components/superadmin/tenant/detail-tenant-dialog";
import { useTenant } from "@/hooks/superadmin/use-tenant";
import type { Tenant } from "@/types/superadmin/tenant";

export default function DetailSubscriptionPage() {
  const { tenants, loading } = useTenant({ exclude_status: "pending" });
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

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
            <BreadcrumbPage>Detail Subscription</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Page Content */}
      <div className="p-8">
        <TenantTable
          tenants={tenants}
          loading={loading}
          onView={(tenant) => setSelectedTenant(tenant)}
        />
      </div>

      {/* Detail Dialog */}
      <DetailTenantDialog
        tenant={selectedTenant}
        onClose={() => setSelectedTenant(null)}
      />
    </div>
  );
}
