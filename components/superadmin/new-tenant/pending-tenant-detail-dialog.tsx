"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2, User, CreditCard, MapPin, CalendarDays,
  Store, CheckCircle2, XCircle, Clock, Mail, AtSign,
  ShieldCheck, Wallet, FileText
} from "lucide-react";
import { tenantService } from "@/services/superadmin/tenantServices";
import type { Tenant } from "@/types/superadmin/tenant";

interface Props {
  tenantId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (tenant: Tenant) => void;
  onReject?: (tenant: Tenant) => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    active:    { label: "Aktif",      className: "bg-emerald-50 text-emerald-700 border border-emerald-200", icon: <CheckCircle2 size={11} /> },
    approved:  { label: "Disetujui",  className: "bg-emerald-50 text-emerald-700 border border-emerald-200", icon: <CheckCircle2 size={11} /> },
    pending:   { label: "Pending",    className: "bg-amber-50   text-amber-700   border border-amber-200",   icon: <Clock size={11} />        },
    rejected:  { label: "Ditolak",    className: "bg-red-50     text-red-700     border border-red-200",     icon: <XCircle size={11} />      },
    suspended: { label: "Suspended",  className: "bg-gray-100   text-gray-500   border border-gray-200",    icon: <XCircle size={11} />      },
    cancelled: { label: "Dibatalkan", className: "bg-gray-100   text-gray-500   border border-gray-200",    icon: <XCircle size={11} />      },
  };
  const style = map[status?.toLowerCase()] ?? { label: status, className: "bg-gray-100 text-gray-500 border border-gray-200", icon: null };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${style.className}`}>
      {style.icon}{style.label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-gray-100 last:border-b-0 gap-4">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-800 text-right break-words max-w-[60%]">{value ?? '-'}</span>
    </div>
  );
}

type TabKey = "usaha" | "owner" | "pembayaran";

// ── Component ─────────────────────────────────────────────────────────────────

export function PendingTenantDetailDialog({ tenantId, open, onOpenChange, onApprove, onReject }: Props) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("usaha");

  useEffect(() => {
    if (!open || !tenantId) return;
    setLoading(true);
    setError(null);
    setActiveTab("usaha");
    tenantService.detail(tenantId)
      .then(res => setTenant(res.data))
      .catch(() => setError("Gagal memuat detail tenant."))
      .finally(() => setLoading(false));
  }, [open, tenantId]);

  if (!open) return null;

  const planName = typeof tenant?.subscription?.plan === "string"
    ? tenant.subscription.plan
    : (tenant?.subscription?.plan as any)?.nama_plan ?? "-";

  const planPrice = typeof tenant?.subscription?.plan === "object"
    ? Number((tenant?.subscription?.plan as any)?.harga ?? 0)
    : 0;

  const initials = tenant
    ? tenant.nama_usaha.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase()
    : "??";

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "usaha",      label: "Info Usaha",   icon: <Building2 size={14} />  },
    { key: "owner",      label: "Owner",         icon: <User size={14} />       },
    { key: "pembayaran", label: "Pembayaran",    icon: <Wallet size={14} />     },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-2xl gap-0">

        {/* ── Header ── */}
        <div className="bg-gradient-to-br from-[#FF6600] to-[#FF8C42] px-6 pt-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-white/70 text-sm font-medium mb-3">
              Detail Pendaftaran Tenant
            </DialogTitle>
          </DialogHeader>

          {/* Avatar + Info */}
          <div className="flex items-center gap-4 mb-5">
            {loading ? (
              <div className="flex items-center gap-4 w-full">
                <Skeleton className="w-14 h-14 rounded-2xl bg-white/20 shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40 bg-white/20" />
                  <Skeleton className="h-3 w-32 bg-white/20" />
                </div>
              </div>
            ) : tenant ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <h3 className="text-white text-lg font-bold leading-tight truncate">{tenant.nama_usaha}</h3>
                  <p className="text-white/70 text-sm mt-0.5 truncate">{tenant.email}</p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <StatusBadge status={tenant.status} />
                    <span className="text-white/60 text-xs flex items-center gap-1">
                      <Store size={11} />{tenant.outlets_count} outlet
                    </span>
                    {planName !== "-" && (
                      <span className="text-white/60 text-xs flex items-center gap-1">
                        <CreditCard size={11} />{planName}
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : null}
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
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Content ── */}
        <div className="px-6 py-4 min-h-[220px] max-h-[52vh] overflow-y-auto">

          {loading ? (
            <div className="space-y-3 pt-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : tenant ? (
            <>
              {/* Tab: Info Usaha */}
              {activeTab === "usaha" && (
                <div>
                  <div className="flex items-center gap-3 mb-4 p-3 bg-orange-50 rounded-xl border border-orange-100">
                    <div className="w-10 h-10 rounded-xl bg-[#FF6600]/10 flex items-center justify-center shrink-0">
                      <Building2 size={18} className="text-[#FF6600]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{tenant.nama_usaha}</p>
                      <p className="text-xs text-gray-500 truncate">{tenant.email}</p>
                    </div>
                    <StatusBadge status={tenant.status} />
                  </div>

                  <InfoRow label="Alamat" value={
                    <span className="flex items-start gap-1 justify-end">
                      <MapPin size={13} className="text-gray-400 mt-0.5 shrink-0" />
                      <span>{tenant.alamat || '-'}</span>
                    </span>
                  } />
                  <InfoRow label="Jumlah Outlet" value={
                    <span className="flex items-center gap-1">
                      <Store size={13} className="text-gray-400" />{tenant.outlets_count}
                    </span>
                  } />
                  <InfoRow label="Terdaftar" value={
                    <span className="flex items-center gap-1">
                      <CalendarDays size={13} className="text-gray-400" />{tenant.created_at}
                    </span>
                  } />
                  {tenant.catatan_admin && (
                    <InfoRow label="Catatan Admin" value={
                      <span className="flex items-start gap-1 justify-end">
                        <FileText size={13} className="text-gray-400 mt-0.5 shrink-0" />
                        <span>{tenant.catatan_admin}</span>
                      </span>
                    } />
                  )}

                  {/* Outlet list */}
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
                      <InfoRow label="Username" value={
                        <span className="flex items-center gap-1 justify-end">
                          <AtSign size={13} className="text-gray-400" />{tenant.owner.username}
                        </span>
                      } />
                      <InfoRow label="Email" value={
                        <span className="flex items-center gap-1 justify-end">
                          <Mail size={13} className="text-gray-400" />{tenant.owner.email}
                        </span>
                      } />
                      <InfoRow label="Status Akun" value={
                        tenant.owner.is_active
                          ? <span className="text-emerald-600 font-semibold flex items-center gap-1"><ShieldCheck size={13} />Aktif</span>
                          : <span className="text-red-500 font-semibold">Nonaktif</span>
                      } />
                    </>
                  ) : (
                    <p className="text-center text-sm text-gray-400 py-8">Data owner tidak tersedia</p>
                  )}
                </div>
              )}

              {/* Tab: Pembayaran */}
              {activeTab === "pembayaran" && (
                <div>
                  {tenant.subscription ? (
                    <>
                      <div className="flex items-center gap-3 mb-4 p-3 bg-orange-50 rounded-xl border border-orange-100">
                        <div className="w-10 h-10 rounded-xl bg-[#FF6600]/10 flex items-center justify-center shrink-0">
                          <CreditCard size={18} className="text-[#FF6600]" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Plan Dipilih</p>
                          <p className="text-sm font-bold text-gray-800">{planName}</p>
                        </div>
                        <div className="ml-auto">
                          <StatusBadge status={tenant.subscription.status} />
                        </div>
                      </div>

                      <InfoRow label="Plan"     value={<span className="font-bold text-orange-600">{planName}</span>} />
                      <InfoRow label="Harga"    value={planPrice > 0 ? `Rp ${planPrice.toLocaleString("id-ID")}` : <span className="text-emerald-600 font-semibold">Gratis</span>} />
                      <InfoRow label="Status"   value={<StatusBadge status={tenant.subscription.status} />} />
                      {tenant.subscription.start_date && (
                        <InfoRow label="Mulai"    value={tenant.subscription.start_date} />
                      )}
                      {tenant.subscription.end_date && (
                        <InfoRow label="Berakhir" value={tenant.subscription.end_date} />
                      )}

                      {/* Status Pembayaran Banner */}
                      <div className={`mt-5 rounded-xl p-4 border ${
                        planPrice === 0
                          ? "bg-blue-50 border-blue-100"
                          : tenant.subscription.status === "active"
                          ? "bg-emerald-50 border-emerald-100"
                          : "bg-amber-50 border-amber-100"
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          {planPrice === 0 ? (
                            <><CheckCircle2 size={15} className="text-blue-500 shrink-0" />
                              <span className="text-sm font-semibold text-blue-700">Plan Gratis — tidak perlu pembayaran</span></>
                          ) : tenant.subscription.status === "active" ? (
                            <><CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                              <span className="text-sm font-semibold text-emerald-700">Pembayaran sudah dikonfirmasi</span></>
                          ) : (
                            <><Clock size={15} className="text-amber-500 shrink-0" />
                              <span className="text-sm font-semibold text-amber-700">Menunggu konfirmasi pembayaran</span></>
                          )}
                        </div>
                        {planPrice > 0 && tenant.subscription.status !== "active" && (
                          <p className="text-xs text-amber-600 leading-relaxed">
                            Pastikan pembayaran sebesar <strong>Rp {planPrice.toLocaleString("id-ID")}</strong> sudah diterima sebelum menyetujui pendaftaran.
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="rounded-xl bg-gray-50 border border-gray-100 p-6 text-center mt-2">
                      <Wallet size={28} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Belum ada data subscription / pembayaran</p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 pb-5 pt-2 flex gap-2.5">
          {tenant && onReject && (
            <button
              onClick={() => { onReject(tenant); onOpenChange(false); }}
              className="flex-1 py-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <XCircle size={15} /> Tolak
            </button>
          )}
          {tenant && onApprove && (
            <button
              onClick={() => { onApprove(tenant); onOpenChange(false); }}
              className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={15} /> Setujui
            </button>
          )}
          {!onApprove && !onReject && (
            <button
              onClick={() => onOpenChange(false)}
              className="w-full py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold transition-colors"
            >Tutup</button>
          )}
        </div>

      </DialogContent>
    </Dialog>
  );
}
