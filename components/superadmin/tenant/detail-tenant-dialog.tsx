"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Building2, User, CreditCard, MapPin, CalendarDays, Store, CheckCircle2, XCircle, Clock } from "lucide-react"
import type { Tenant } from "@/types/superadmin/tenant"

interface DetailTenantDialogProps {
    tenant: Tenant | null
    onClose: () => void
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
        active: { label: "Aktif", className: "bg-emerald-50 text-emerald-700 border border-emerald-200", icon: <CheckCircle2 size={12} /> },
        approved: { label: "Disetujui", className: "bg-emerald-50 text-emerald-700 border border-emerald-200", icon: <CheckCircle2 size={12} /> },
        pending: { label: "Menunggu", className: "bg-amber-50   text-amber-700   border border-amber-200", icon: <Clock size={12} /> },
        rejected: { label: "Ditolak", className: "bg-red-50     text-red-700     border border-red-200", icon: <XCircle size={12} /> },
        suspended: { label: "Suspended", className: "bg-gray-100   text-gray-600   border border-gray-200", icon: <XCircle size={12} /> },
    }
    const style = map[status?.toLowerCase()] ?? { label: status, className: "bg-gray-100 text-gray-600 border border-gray-200", icon: null }
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${style.className}`}>
            {style.icon}{style.label}
        </span>
    )
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between py-2.5 border-b border-gray-100 last:border-b-0 gap-4">
            <span className="text-sm text-gray-500 shrink-0">{label}</span>
            <span className="text-sm font-medium text-gray-800 text-right break-words max-w-[60%]">{value ?? '-'}</span>
        </div>
    )
}

// ── Tab definitions ───────────────────────────────────────────────────────────

type TabKey = "usaha" | "owner" | "subscription"

// ── Component ─────────────────────────────────────────────────────────────────

export function DetailTenantDialog({ tenant, onClose }: DetailTenantDialogProps) {
    const [activeTab, setActiveTab] = useState<TabKey>("usaha")

    if (!tenant) return null

    const planName = typeof tenant.subscription?.plan === "string"
        ? tenant.subscription.plan
        : (tenant.subscription?.plan as any)?.nama_plan ?? "-"

    const initials = tenant.nama_usaha
        .split(" ")
        .slice(0, 2)
        .map(w => w[0])
        .join("")
        .toUpperCase()

    const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
        { key: "usaha", label: "Info Usaha", icon: <Building2 size={14} /> },
        { key: "owner", label: "Owner", icon: <User size={14} /> },
        { key: "subscription", label: "Subscription", icon: <CreditCard size={14} /> },
    ]

    return (
        <Dialog open={!!tenant} onOpenChange={(open) => { if (!open) onClose() }}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl gap-0">

                {/* ── Header ── */}
                <div className="bg-gradient-to-br from-[#FF6600] to-[#FF8C42] px-6 pt-6 pb-0">
                    <DialogHeader>
                        <DialogTitle className="text-white/70 text-sm font-medium mb-3">
                            Detail Tenant
                        </DialogTitle>
                    </DialogHeader>

                    {/* Avatar + Info Ringkas */}
                    <div className="flex items-center gap-4 mb-5">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xl font-bold shrink-0">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-white text-lg font-bold leading-tight truncate">{tenant.nama_usaha}</h3>
                            <p className="text-white/70 text-sm mt-0.5 truncate">{tenant.email}</p>
                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                                <StatusBadge status={tenant.status} />
                                <span className="text-white/60 text-xs flex items-center gap-1">
                                    <Store size={11} />
                                    {tenant.outlets_count} outlet
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Tab Bar */}
                    <div className="flex gap-0 border-b border-white/20">
                        {tabs.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all border-b-2
                                    ${activeTab === tab.key
                                        ? "text-white border-white"
                                        : "text-white/50 border-transparent hover:text-white/80"
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Tab Content ── */}
                <div className="px-6 py-4 min-h-[200px] max-h-[50vh] overflow-y-auto">

                    {/* Tab: Info Usaha */}
                    {activeTab === "usaha" && (
                        <div>
                            <InfoRow label="Status" value={<StatusBadge status={tenant.status} />} />
                            <InfoRow label="Alamat" value={
                                <span className="flex items-start gap-1 justify-end">
                                    <MapPin size={13} className="text-gray-400 mt-0.5 shrink-0" />
                                    <span>{tenant.alamat || '-'}</span>
                                </span>
                            } />
                            <InfoRow label="Jumlah Outlet" value={tenant.outlets_count} />
                            <InfoRow label="Terdaftar" value={
                                <span className="flex items-center gap-1 justify-end">
                                    <CalendarDays size={13} className="text-gray-400 shrink-0" />
                                    {tenant.created_at}
                                </span>
                            } />
                            {tenant.approved_at && (
                                <InfoRow label="Disetujui" value={tenant.approved_at} />
                            )}
                            {tenant.catatan_admin && (
                                <InfoRow label="Catatan Admin" value={tenant.catatan_admin} />
                            )}

                            {/* Daftar Outlet (jika ada) */}
                            {tenant.outlets && tenant.outlets.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Daftar Outlet</p>
                                    <div className="space-y-1.5">
                                        {tenant.outlets.map(o => (
                                            <div key={o.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5">
                                                <span className="text-sm text-gray-700 font-medium">{o.nama_outlet}</span>
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${o.status_buka ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {o.status_buka ? 'Buka' : 'Tutup'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tab: Owner */}
                    {activeTab === "owner" && (
                        <div>
                            {tenant.owner ? (
                                <>
                                    <div className="flex items-center gap-3 mb-4 p-3 bg-orange-50 rounded-xl border border-orange-100">
                                        <div className="w-10 h-10 rounded-xl bg-[#FF6600]/10 flex items-center justify-center shrink-0">
                                            <User size={18} className="text-[#FF6600]" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">{tenant.owner.nama_lengkap}</p>
                                            <p className="text-xs text-gray-500">@{tenant.owner.username}</p>
                                        </div>
                                        {tenant.owner.is_active
                                            ? <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Aktif</span>
                                            : <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600">Nonaktif</span>
                                        }
                                    </div>
                                    <InfoRow label="Nama Lengkap" value={tenant.owner.nama_lengkap} />
                                    <InfoRow label="Username" value={`@${tenant.owner.username}`} />
                                    <InfoRow label="Email" value={tenant.owner.email} />
                                    <InfoRow label="Status Akun" value={
                                        tenant.owner.is_active
                                            ? <span className="text-emerald-600 font-semibold">Aktif</span>
                                            : <span className="text-red-500 font-semibold">Nonaktif</span>
                                    } />
                                </>
                            ) : (
                                <p className="text-center text-sm text-gray-400 py-8">Data owner tidak tersedia</p>
                            )}
                        </div>
                    )}

                    {/* Tab: Subscription */}
                    {activeTab === "subscription" && (
                        <div>
                            {tenant.subscription ? (
                                <>
                                    <div className="flex items-center gap-3 mb-4 p-3 bg-orange-50 rounded-xl border border-orange-100">
                                        <div className="w-10 h-10 rounded-xl bg-[#FF6600]/10 flex items-center justify-center shrink-0">
                                            <CreditCard size={18} className="text-[#FF6600]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 mb-0.5">Plan Aktif</p>
                                            <p className="text-sm font-bold text-gray-800">{planName}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <StatusBadge status={tenant.subscription.status} />
                                        </div>
                                    </div>
                                    <InfoRow label="Plan" value={<span className="font-semibold text-orange-600">{planName}</span>} />
                                    <InfoRow label="Status" value={<StatusBadge status={tenant.subscription.status} />} />
                                    {tenant.subscription.start_date && (
                                        <InfoRow label="Mulai" value={tenant.subscription.start_date} />
                                    )}
                                    {tenant.subscription.end_date && (
                                        <InfoRow label="Berakhir" value={tenant.subscription.end_date} />
                                    )}
                                </>
                            ) : (
                                <p className="text-center text-sm text-gray-400 py-8">Belum ada subscription</p>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                <div className="px-6 pb-5">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors"
                    >
                        Tutup
                    </button>
                </div>

            </DialogContent>
        </Dialog>
    )
}