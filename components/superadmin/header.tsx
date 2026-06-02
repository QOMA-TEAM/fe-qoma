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
import { HeaderActions } from "@/components/dashboard/header-actions";

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
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
      {/* Left: Welcome Text */}
      <div>
        <h2 className="text-[#1E293B] text-[15px] font-bold">
          {getPageTitle()}
        </h2>
      </div>

      {/* Right: Actions */}
      <HeaderActions />

      <ChangePasswordDialog 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen} 
      />
    </header>
  );
}
