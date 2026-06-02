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
import { Button } from "@/components/ui/button";
import { PendingTenantTable } from "@/components/superadmin/new-tenant/pending-tenant-table";
import { DetailTenantDialog } from "@/components/superadmin/tenant/detail-tenant-dialog";
import { RejectTenantDialog } from "@/components/superadmin/new-tenant/reject-tenant-dialog";
import { useTenant } from "@/hooks/superadmin/use-tenant";
import type { Tenant } from "@/types/superadmin/tenant";
import { PlanBreadcrumb } from "@/components/superadmin/plan/breadcrumb";
import { cn } from "@/lib/utils";

export default function NewTenantPage() {
  const [page, setPage] = useState(1);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [tenantToReject, setTenantToReject] = useState<Tenant | null>(null);

  const { tenants, loading, meta, approveTenant, rejectTenant } = useTenant({
    status: "pending",
    page,
  });

  const handleApprove = async (tenant: Tenant) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menyetujui pendaftaran tenant ${tenant.nama_usaha}?`
      )
    ) {
      await approveTenant(tenant.id);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      {/* Top Header */}
      <SuperadminHeader username="Super Admin" notificationCount={3} />

      <main className="flex-1 px-6 py-6 max-w-screen-xl mx-auto w-full space-y-6">
        {/* Breadcrumb */}
        <PlanBreadcrumb />


        {/* Page Content */}
        <div className="p-8 space-y-4">
          <PendingTenantTable
            tenants={tenants}
            loading={loading}
            onView={(tenant) => setSelectedTenant(tenant)}
            onApprove={handleApprove}
            onReject={(tenant) => setTenantToReject(tenant)}
          />

          {/* Pagination Controls */}
          {meta && meta.total > 0 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-500">
                Menampilkan{" "}
                <span className="font-medium text-gray-900">
                  {meta.from || 0}
                </span>{" "}
                hingga{" "}
                <span className="font-medium text-gray-900">{meta.to || 0}</span>{" "}
                dari{" "}
                <span className="font-medium text-gray-900">{meta.total}</span>{" "}
                data
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-8 rounded-full px-4 text-xs font-medium"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={cn(
                          "size-8 rounded-full text-xs font-medium transition-colors",
                          page === pageNum
                            ? "bg-[#1D5E84] text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                  disabled={page === meta.last_page}
                  className="h-8 rounded-full px-4 text-xs font-medium"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Detail Dialog */}
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