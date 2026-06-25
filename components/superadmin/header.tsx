"use client";

import { usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HeaderActions } from "@/components/dashboard/header-actions";

// Maps each route to a readable label + section group
const routeMap: Record<string, { label: string; group: string }> = {
    "/superadmin/dashboard": { label: "Dashboard", group: "Overview" },
    "/superadmin/tenant": { label: "Tenant", group: "Kelola" },
    "/superadmin/new-tenant": { label: "Tenant Baru", group: "Kelola" },
    "/superadmin/plan": { label: "Plan", group: "Kelola" },
    "/superadmin/upgrade-request": { label: "Upgrade Request", group: "Kelola" },
};

interface SuperadminHeader {
  username?: string;
  notificationCount?: number;
}

export function SuperadminHeader({
  username = "Super Admin",
  notificationCount = 3,
}: SuperadminHeader) {
  const pathname = usePathname();
  const route = routeMap[pathname];

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
      {/* Breadcrumb — grows to fill available space */}
      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          {route ? (
            <>
              <BreadcrumbItem>
                <span className="text-sm text-muted-foreground uppercase font-medium">
                  {route.group}
                </span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-semibold text-[#1E293B]">
                  {route.label}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm font-semibold text-[#1E293B]">Superadmin</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Right: Actions */}
      <HeaderActions />
    </header>
  );
}
