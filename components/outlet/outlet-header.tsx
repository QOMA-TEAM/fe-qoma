"use client";

import { Store, Loader2, Settings, Bell } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChangePasswordDialog } from "@/components/settings/change-password-dialog";
import { useOutletDashboard, useToggleOutletStatus } from "@/hooks/outlet/use-dashboard";

// Mirrors sidebar nav — maps each route to a readable label + section group
const routeMap: Record<string, { label: string; group: string }> = {
    "/outlet/dashboard": { label: "Dashboard", group: "Overview" },
    "/outlet/pesanan-datang": { label: "Pesanan Datang", group: "Sales" },
    "/outlet/bahan-baku": { label: "Bahan Baku", group: "Kelola" },
    "/outlet/menu": { label: "Menu", group: "Kelola" },
    "/outlet/stock-opname": { label: "Stock Opname", group: "Kelola" },
    "/outlet/meja": { label: "Meja", group: "Kelola" },
    "/outlet/detail-keuangan": { label: "Detail Keuangan", group: "Financial" },
    "/outlet/activity-log": { label: "Activity Log", group: "Financial" },
};

export function OutletHeader() {
    const { data: dashboardData, isLoading } = useOutletDashboard();
    const { mutate: toggleStatus, isPending } = useToggleOutletStatus();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const isOpen = dashboardData?.data?.outlet?.status_buka ?? false;
    const pathname = usePathname();
    const route = routeMap[pathname];

    return (
        <>
            <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
                {/* Breadcrumb — grows to fill available space */}
                <Breadcrumb className="flex-1">
                    <BreadcrumbList>
                        {route ? (
                            <>
                                <BreadcrumbItem className="text-[#1E293B]">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {route.group}
                                    </span>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-sm font-bold">
                                        {route.label}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </>
                        ) : (
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-sm font-bold">Outlet</BreadcrumbPage>
                            </BreadcrumbItem>
                        )}
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => toggleStatus()}
                        disabled={isLoading || isPending}
                        className={`flex items-center justify-center size-9 rounded-full border border-gray-200 transition-colors cursor-pointer ${
                            isLoading
                                ? "bg-gray-50 text-gray-400"
                                : isOpen
                                    ? "bg-green-50 text-green-600 hover:bg-green-100"
                                    : "bg-red-50 text-red-500 hover:bg-red-100"
                            }`}
                        title={isOpen ? "Outlet Sedang Buka (Klik untuk Tutup)" : "Outlet Sedang Tutup (Klik untuk Buka)"}
                        aria-label="Toggle outlet status"
                    >
                        {isLoading || isPending ? <Loader2 className="size-4 animate-spin" /> : <Store className="size-4" />}
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex items-center justify-center size-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                        aria-label="Settings"
                    >
                        <Settings className="size-4" />
                    </button>

                    <button
                        type="button"
                        className="relative flex items-center justify-center size-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                        aria-label="Notifications"
                    >
                        <Bell className="size-4" />
                        <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-orange-500 ring-2 ring-white" />
                    </button>
                </div>
            </header>

            <ChangePasswordDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
        </>
    );
}