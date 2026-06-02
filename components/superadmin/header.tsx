"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChangePasswordDialog } from "@/components/settings/change-password-dialog";

interface SuperadminHeader {
  username?: string;
  notificationCount?: number;
}

export function SuperadminHeader({
  username = "Super Admin",
  notificationCount = 3,
}: SuperadminHeader) {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const getPageTitle = () => {
    if (pathname === "/superadmin/dashboard") {
      return `Welcome back, ${username}`;
    }
    if (pathname.includes("/superadmin/new-tenant")) {
      return "Persetujuan Tenant Baru";
    }
    if (pathname.includes("/superadmin/plan")) {
      return "Manajemen Plan";
    }
    if (pathname.includes("/superadmin/tenant")) {
      return "Manajemen Tenant";
    }
    return "Dashboard";
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
      {/* Left: Welcome Text */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Settings */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSettingsOpen(true)}
          className="rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        >
          <Settings className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full text-orange-500 hover:text-orange-600 hover:bg-orange-50"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-orange-500 text-white border-0">
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <div className="px-3 py-2 border-b">
              <p className="text-sm font-semibold text-gray-900">Notifikasi</p>
            </div>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
              <span className="text-sm font-medium text-gray-900">
                Usaha baru menunggu persetujuan
              </span>
              <span className="text-xs text-gray-500">10.30 AM</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
              <span className="text-sm font-medium text-gray-900">
                Pembayaran berhasil diterima
              </span>
              <span className="text-xs text-gray-500">9.20 AM</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 cursor-pointer">
              <span className="text-sm font-medium text-gray-900">
                Tenant baru terdaftar
              </span>
              <span className="text-xs text-gray-500">8.15 AM</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ChangePasswordDialog 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen} 
      />
    </header>
  );
}
