"use client";

import { Loader2, Settings, Bell } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
                                <BreadcrumbItem>
                                    <span className="text-sm text-muted-foreground uppercase">
                                        {route.group}
                                    </span>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-sm">
                                        {route.label}
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </>
                        ) : (
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-sm">Outlet</BreadcrumbPage>
                            </BreadcrumbItem>
                        )}
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
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

            <ChangePasswordDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base font-semibold">Status Outlet</Label>
                        <p className="text-sm text-gray-500">
                            {isOpen ? "Outlet saat ini sedang Buka" : "Outlet saat ini sedang Tutup"}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Switch
                            checked={isOpen}
                            onCheckedChange={() => toggleStatus()}
                            aria-label="Toggle outlet status"
                            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                        />
                    </div>
                </div>
            </ChangePasswordDialog>
        </>
    );
}