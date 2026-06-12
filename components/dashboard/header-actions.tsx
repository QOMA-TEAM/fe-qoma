"use client"

import { Bell, Check, Loader2, Info } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { 
  useNotifications, 
  useUnreadNotificationCount, 
  useMarkNotificationRead, 
  useMarkAllNotificationsRead 
} from "@/hooks/shared/use-notifications"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

interface HeaderActionsProps {
  extraNotifications?: any[];
}

export function HeaderActions({ extraNotifications = [] }: HeaderActionsProps = {}) {
  const { data: unreadData } = useUnreadNotificationCount();
  const { data: notifData, isLoading } = useNotifications(1, 10);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const fetchedUnreadCount = unreadData?.unread_count || 0;
  const fetchedNotifications = notifData?.data || [];

  const notifications = [...extraNotifications, ...fetchedNotifications];
  const unreadCount = fetchedUnreadCount + extraNotifications.filter(n => !n.is_read).length;

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
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-orange-500 ring-2 ring-white text-[10px] font-bold text-white px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden rounded-xl">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50/80 backdrop-blur-sm border-b">
              <span className="font-semibold text-sm text-gray-900">Notifikasi</span>
              {unreadCount > 0 && (
                <button 
                  onClick={() => markAllRead.mutate()}
                  disabled={markAllRead.isPending || fetchedUnreadCount === 0}
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50"
                >
                  Tandai semua dibaca
                </button>
              )}
            </div>

            <div className="max-h-[350px] overflow-y-auto">
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
                  {notifications.map((notif) => (
                    <DropdownMenuItem 
                      key={notif.id}
                      className="flex flex-col items-start px-4 py-3 gap-1 cursor-pointer focus:bg-gray-50 border-b last:border-0 rounded-none relative overflow-hidden group"
                      onClick={() => {
                        if (!notif.is_read && !notif.id.startsWith('alert-')) {
                          markRead.mutate(notif.id);
                        }
                      }}
                    >
                      {!notif.is_read && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
                      )}
                      
                      <div className="flex items-start gap-3 w-full">
                        <div className={`mt-0.5 shrink-0 rounded-full p-2 ${notif.is_read ? 'bg-gray-100 text-gray-500' : 'bg-orange-100 text-orange-600'}`}>
                          <Info className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${notif.is_read ? 'text-gray-600 font-medium' : 'text-gray-900 font-bold'}`}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-gray-400 mt-1.5 block">
                            {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: id })}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
