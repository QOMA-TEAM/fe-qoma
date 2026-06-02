"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Tenant } from "@/types/superadmin/tenant"

interface DetailTenantDialogProps {
    tenant: Tenant | null
    onClose: () => void
}

export function DetailTenantDialog({ tenant, onClose }: DetailTenantDialogProps) {
    if (!tenant) return null

    return (
        <Dialog open={!!tenant} onOpenChange={(open) => { if (!open) onClose() }}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-gray-800">Detail Tenant</DialogTitle>
                </DialogHeader>

                <div className="border-t border-gray-200 my-1" />

                <div className="space-y-4 mt-2">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">{tenant.nama_usaha}</h3>
                        <span className="text-sm text-gray-500">{tenant.email}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                        <div>
                            <h4 className="text-sm font-bold text-gray-700 mb-2">Informasi Usaha</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status</span>
                                    <span className="text-gray-800 font-medium capitalize">{tenant.status}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Alamat</span>
                                    <span className="text-gray-800 font-medium">{tenant.alamat || '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Jumlah Outlet</span>
                                    <span className="text-gray-800 font-medium">{tenant.outlets_count}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Terdaftar</span>
                                    <span className="text-gray-800 font-medium">{tenant.created_at}</span>
                                </div>
                                {tenant.approved_at && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Disetujui</span>
                                        <span className="text-gray-800 font-medium">{tenant.approved_at}</span>
                                    </div>
                                )}
                                {tenant.catatan_admin && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Catatan</span>
                                        <span className="text-gray-800 font-medium">{tenant.catatan_admin}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-gray-700 mb-2">Owner</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Nama</span>
                                    <span className="text-gray-800 font-medium">{tenant.owner?.nama_lengkap ?? '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Username</span>
                                    <span className="text-gray-800 font-medium">{tenant.owner?.username ?? '-'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Email</span>
                                    <span className="text-gray-800 font-medium">{tenant.owner?.email ?? '-'}</span>
                                </div>
                            </div>

                            {tenant.subscription && (
                                <>
                                    <h4 className="text-sm font-bold text-gray-700 mb-2 mt-4">Subscription</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Plan</span>
                                            <span className="text-gray-800 font-medium">
                                                {typeof tenant.subscription.plan === 'string'
                                                    ? tenant.subscription.plan
                                                    : (tenant.subscription.plan as any)?.nama_plan ?? '-'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Status</span>
                                            <span className="text-gray-800 font-medium capitalize">{tenant.subscription.status}</span>
                                        </div>
                                        {tenant.subscription.start_date && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Mulai</span>
                                                <span className="text-gray-800 font-medium">{tenant.subscription.start_date}</span>
                                            </div>
                                        )}
                                        {tenant.subscription.end_date && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Berakhir</span>
                                                <span className="text-gray-800 font-medium">{tenant.subscription.end_date}</span>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-4">
                    <Button onClick={onClose} className="rounded-full px-10 bg-blue-600 hover:bg-blue-700 text-white">
                        Tutup
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
