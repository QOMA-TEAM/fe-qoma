"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TenantTable } from "@/components/superadmin/tenant/tenant-table";
import { DetailTenantDialog } from "@/components/superadmin/tenant/detail-tenant-dialog";
import { useTenant } from "@/hooks/superadmin/use-tenant";
import type { Tenant } from "@/types/superadmin/tenant";
import { cn } from "@/lib/utils";

export function TenantContent() {
  const [page, setPage] = useState(1);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const { tenants, loading, meta } = useTenant({
    exclude_status: "pending",
    page,
  });

  return (
    <>
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Kelola Tenant</h2>
          <p className="text-sm text-gray-500 mt-0.5">Informasi detail Data Tenant</p>
        </div>

        {/* Page Content */}
        <div className="space-y-4">
          <TenantTable
            tenants={tenants}
            loading={loading}
            onView={(tenant) => setSelectedTenant(tenant)}
          />

          {/* Pagination Controls */}
          {meta && meta.total > 0 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-500">
                Menampilkan Halaman <span className="font-medium text-gray-900">{meta.current_page || 1}</span> dari <span className="font-medium text-gray-900">{meta.last_page || 1}</span> halaman
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="h-8 rounded-full px-4 text-xs font-medium cursor-pointer"
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
                            ? "bg-[#1D5E84] hover:bg-[#154663] text-white"
                            : "text-gray-600 hover:bg-gray-100 cursor-pointer"
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
                  className="h-8 rounded-full px-4 text-xs font-medium cursor-pointer"
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
    </>
  );
}
