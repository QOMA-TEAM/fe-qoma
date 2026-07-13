"use client"

import { useState, useMemo } from "react"
import { Bell, Loader2, Info, CheckCircle2, AlertTriangle, Clock, X, Megaphone, ShoppingBag, CreditCard } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  useNotifications,
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead
} from "@/hooks/shared/use-notifications"
import { Notification } from "@/services/shared/notification-service"
import { formatDistanceToNow, format } from "date-fns"
import { id } from "date-fns/locale"

interface HeaderActionsProps {
  extraNotifications?: any[];
  onMarkAlertRead?: (id: string) => void;
  onMarkAllAlertsRead?: () => void;
}

// ─── Helper: icon & warna per type notif ────────────────────────────────────
function getNotifMeta(type: string) {
  switch (type) {
    case "registration":
      return { icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700", label: "Registrasi" };
    case "subscription":
      return { icon: CreditCard, color: "text-purple-600", bg: "bg-purple-50", badge: "bg-purple-100 text-purple-700", label: "Subscription" };
    case "approval":
      return { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50", badge: "bg-green-100 text-green-700", label: "Approval" };
    case "rejection":
      return { icon: X, color: "text-red-600", bg: "bg-red-50", badge: "bg-red-100 text-red-700", label: "Penolakan" };
    case "warning":
    case "stok_menipis":
    case "mendekati_expired":
      return { icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50", badge: "bg-orange-100 text-orange-700", label: "Peringatan" };
    case "sudah_expired":
      return { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", badge: "bg-red-100 text-red-700", label: "Kedaluwarsa" };
    case "info":
      return { icon: Info, color: "text-sky-600", bg: "bg-sky-50", badge: "bg-sky-100 text-sky-700", label: "Info" };
    case "promo":
      return { icon: Megaphone, color: "text-pink-600", bg: "bg-pink-50", badge: "bg-pink-100 text-pink-700", label: "Promo" };
    default:
      return { icon: Info, color: "text-gray-500", bg: "bg-gray-100", badge: "bg-gray-100 text-gray-600", label: type || "Notifikasi" };
  }
}

// ─── Popup Detail Notifikasi ─────────────────────────────────────────────────
function NotifDetailDialog({
  notif,
  isRead,
  onClose,
}: {
  notif: (Notification & { is_read: boolean }) | null;
  isRead: boolean;        // optimistic dari parent
  onClose: () => void;
}) {
  if (!notif) return null;
  const meta = getNotifMeta(notif.type);
  const Icon = meta.icon;

  return (
    <Dialog open={!!notif} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden gap-0 border-0 shadow-2xl">
        {/* Header berwarna */}
        <div className={`${meta.bg} px-6 pt-6 pb-5 border-b`}>
          <div className="flex items-start gap-4">
            <div className={`shrink-0 rounded-xl p-3 ${meta.bg} border border-current/10`}>
              <Icon className={`w-6 h-6 ${meta.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${meta.badge}`}>
                  {meta.label}
                </span>
                {/* Gunakan isRead (optimistic) */}
                {isRead ? (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Sudah dibaca
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                    Belum dibaca
                  </span>
                )}
              </div>
              <DialogTitle className="text-base font-bold text-gray-900 leading-snug">
                {notif.title}
              </DialogTitle>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Pesan */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Pesan</p>
            <p className="text-sm text-gray-700 leading-relaxed">{notif.message}</p>
          </div>

          {/* Data tambahan (jika ada) */}
          {notif.data && typeof notif.data === "object" && Object.keys(notif.data).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Detail</p>
              <div className="rounded-lg bg-gray-50 border border-gray-100 divide-y divide-gray-100 overflow-hidden">
                {Object.entries(notif.data).map(([key, val]) => (
                  <div key={key} className="flex items-start gap-3 px-3 py-2">
                    <span className="text-xs text-gray-400 font-medium capitalize min-w-[80px] shrink-0 pt-0.5">
                      {key.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-gray-700 break-words flex-1">
                      {String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Waktu */}
          <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>
              {format(new Date(notif.created_at), "dd MMM yyyy, HH:mm", { locale: id })}
              {" · "}
              {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: id })}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <Button
            onClick={onClose}
            className="w-full rounded-xl bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium transition-colors"
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
export function HeaderActions({ extraNotifications = [], onMarkAlertRead, onMarkAllAlertsRead }: HeaderActionsProps = {}) {
  const { data: unreadData } = useUnreadNotificationCount();
  const { data: notifData, isLoading } = useNotifications(1, 15);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  // Notif yang sedang dibuka di dialog
  const [selectedNotif, setSelectedNotif] = useState<(Notification & { is_read: boolean }) | null>(null);

  // Optimistic tracking — ID yang sudah diklik/dibaca di sesi ini
  const [localReadIds, setLocalReadIds] = useState<string[]>([]);
  const [allMarkedRead, setAllMarkedRead] = useState(false);

  const fetchedUnreadCount = unreadData?.unread_count || 0;
  const fetchedNotifications = notifData?.data || [];

  // Hitung unread secara optimistic — langsung berkurang saat diklik
  const unreadCount = useMemo(() => {
    if (allMarkedRead) return 0;
    
    // Hitung berapa notif server yang sudah di-klik di frontend
    const localServerReadCount = fetchedNotifications.filter(
      n => !n.is_read && localReadIds.includes(String(n.id))
    ).length;
    
    const serverUnread = Math.max(0, fetchedUnreadCount - localServerReadCount);
    const extraUnread = extraNotifications.filter(n => !n.is_read && !localReadIds.includes(String(n.id))).length;
    
    return serverUnread + extraUnread;
  }, [fetchedUnreadCount, localReadIds, extraNotifications, fetchedNotifications, allMarkedRead]);

  // Merge notifikasi + override is_read secara optimistic
  const notifications = useMemo(() => {
    const all = [...extraNotifications, ...fetchedNotifications];
    if (allMarkedRead) return all.map(n => ({ ...n, is_read: true }));
    return all.map(n => ({
      ...n,
      is_read: n.is_read || localReadIds.includes(String(n.id)),
    }));
  }, [extraNotifications, fetchedNotifications, localReadIds, allMarkedRead]);

  const handleNotifClick = (notif: any) => {
    const idStr = String(notif.id);
    // Optimistic: langsung tandai dibaca di UI (tanpa nunggu refetch)
    if (!notif.is_read && !localReadIds.includes(idStr)) {
      setLocalReadIds(prev => [...prev, idStr]);
      if (idStr.startsWith("alert-")) {
        if (onMarkAlertRead) onMarkAlertRead(idStr);
      } else {
        markRead.mutate(idStr);
      }
    }
    // Buka dialog
    setSelectedNotif(notif);
  };

  const handleMarkAllRead = () => {
    setAllMarkedRead(true);
    markAllRead.mutate();
    if (onMarkAllAlertsRead) onMarkAllAlertsRead();
  };

  // Status is_read di dialog — optimistic
  const selectedIsRead = selectedNotif
    ? selectedNotif.is_read || localReadIds.includes(String(selectedNotif.id)) || allMarkedRead
    : false;

  return (
    <>
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="relative flex items-center justify-center size-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="size-4" />
              {/* Badge unread — selalu render berdasarkan unreadCount optimistic */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-orange-500 ring-2 ring-white text-[10px] font-bold text-white px-1 leading-none">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 backdrop-blur-sm border-b">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-900">Notifikasi</span>
                {unreadCount > 0 && (
                  <span className="text-[11px] font-bold bg-orange-500 text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 leading-none">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={markAllRead.isPending}
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50 cursor-pointer"
                >
                  {markAllRead.isPending ? "Memproses..." : "Tandai semua dibaca"}
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[380px] overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <Loader2 className="w-6 h-6 animate-spin mb-2" />
                  <span className="text-sm">Memuat...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Belum ada notifikasi</p>
                  <p className="text-xs text-gray-500 mt-1">Anda akan melihat pemberitahuan aktivitas di sini.</p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {notifications.map((notif) => {
                    const meta = getNotifMeta(notif.type);
                    const Icon = meta.icon;
                    const isRead = notif.is_read; // sudah di-override optimistic di useMemo
                    return (
                      <DropdownMenuItem
                        key={notif.id}
                        className="flex flex-col items-start px-4 py-3 gap-1 cursor-pointer focus:bg-gray-50 border-b last:border-0 rounded-none relative overflow-hidden group"
                        onClick={() => handleNotifClick(notif)}
                      >
                        {/* Garis kiri unread */}
                        {!isRead && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
                        )}

                        <div className="flex items-start gap-3 w-full pl-1">
                          <div className={`mt-0.5 shrink-0 rounded-full p-1.5 ${isRead ? "bg-gray-100 text-gray-400" : `${meta.bg} ${meta.color}`}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${isRead ? "text-gray-500 font-medium" : "text-gray-900 font-bold"}`}>
                              {notif.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{notif.message}</p>
                            <span className="text-[10px] text-gray-400 mt-1 block">
                              {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: id })}
                            </span>
                          </div>
                          {/* Hint klik untuk detail */}
                          <span className="text-[10px] text-gray-300 group-hover:text-orange-400 transition-colors shrink-0 mt-1 font-medium">
                            Detail →
                          </span>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialog detail notifikasi */}
      <NotifDetailDialog
        notif={selectedNotif}
        isRead={selectedIsRead}
        onClose={() => setSelectedNotif(null)}
      />
    </>
  );
}
