"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PendingTenantTable } from "@/components/superadmin/new-tenant/pending-tenant-table";
import { DetailTenantDialog } from "@/components/superadmin/tenant/detail-tenant-dialog";
import { RejectTenantDialog } from "@/components/superadmin/new-tenant/reject-tenant-dialog";
import { useTenant } from "@/hooks/superadmin/use-tenant";
import type { Tenant } from "@/types/superadmin/tenant";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function PendingTenantContent() {
  const [page, setPage] = useState(1);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [tenantToReject, setTenantToReject] = useState<Tenant | null>(null);
  const [tenantToApprove, setTenantToApprove] = useState<Tenant | null>(null);

  const { tenants, loading, meta, approveTenant, rejectTenant } = useTenant({
    status: "pending",
    page,
  });

  const handleApprove = async (tenant: Tenant) => {
    setTenantToApprove(tenant);
  };

  return (
    <>
      <main className="flex-1 overflow-auto p-6 space-y-6">
        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Pending Tenant</h2>
          <p className="text-sm text-gray-500 mt-0.5">Daftar tenant yang menunggu persetujuan</p>
        </div>

        {/* Page Content */}
        <div className="space-y-4">
          <PendingTenantTable
            tenants={tenants}
            loading={loading}
            onApprove={handleApprove}
            onReject={(tenant) => setTenantToReject(tenant)}
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
                            ? "bg-[#1D5E84] text-white"
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
                  onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
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

      {/* Reject Dialog */}
      <RejectTenantDialog
        tenant={tenantToReject}
        open={!!tenantToReject}
        onOpenChange={(open) => {
          if (!open) setTenantToReject(null);
        }}
        onConfirm={rejectTenant}
      />

      <ConfirmDialog
        open={!!tenantToApprove}
        onOpenChange={(open) => { if (!open) setTenantToApprove(null); }}
        title="Setujui Pendaftaran Tenant"
        description={`Apakah Anda yakin ingin menyetujui pendaftaran tenant "${tenantToApprove?.nama_usaha}"?`}
        confirmLabel="Ya, Setujui"
        cancelLabel="Batal"
        variant="success"
        onConfirm={async () => {
          if (tenantToApprove) {
            await approveTenant(tenantToApprove.id);
            setTenantToApprove(null);
          }
        }}
      />
    </>
  );
}
