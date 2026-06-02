"use client";

import { useState, useEffect } from "react";
import { SuperadminHeader } from "@/components/superadmin/header";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlanBreadcrumb } from "@/components/superadmin/plan/breadcrumb";
import { TenantTable } from "@/components/superadmin/tenant/tenant-table";
import { DetailTenantDialog } from "@/components/superadmin/tenant/detail-tenant-dialog";
import { useTenant } from "@/hooks/superadmin/use-tenant";
import type { Tenant } from "@/types/superadmin/tenant";
import { cn } from "@/lib/utils";

export default function DetailSubscriptionPage() {
  const [page, setPage] = useState(1);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const { tenants, loading, meta } = useTenant({
    exclude_status: "pending",
    page,
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      {/* Top Header */}
      <SuperadminHeader username="Super Admin" notificationCount={3} />

      <main className="flex-1 px-6 py-6 max-w-screen-xl mx-auto w-full space-y-6">
        {/* Breadcrumb */}
        <PlanBreadcrumb />


        {/* Page Content */}
        <div className="p-8 space-y-4">
          <TenantTable
            tenants={tenants}
            loading={loading}
            onView={(tenant) => setSelectedTenant(tenant)}
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
                  onClick={() =>
                    setPage((p) => Math.min(meta.last_page, p + 1))
                  }
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
    </div>
  );
}