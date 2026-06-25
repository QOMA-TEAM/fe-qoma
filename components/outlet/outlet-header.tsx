"use client";

import { Loader2, Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useOutletDashboard } from "@/hooks/outlet/use-dashboard";
import { HeaderActions } from "@/components/dashboard/header-actions";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Mirrors sidebar nav — maps each route to a readable label + section group
const routeMap: Record<string, { label: string; group: string }> = {
    "/outlet/dashboard": { label: "Dashboard", group: "Overview" },
    "/outlet/pesanan-datang": { label: "Pesanan Datang", group: "Sales" },
    "/outlet/bahan-baku": { label: "Bahan Baku", group: "Kelola" },
    "/outlet/menu": { label: "Menu", group: "Kelola" },
    "/outlet/stock-opname": { label: "Stock Opname", group: "Kelola" },
    "/outlet/meja": { label: "Meja", group: "Kelola" },
    "/outlet/riwayat-pesanan": { label: "Riwayat Pesanan", group: "Sales" },
    "/outlet/detail-keuangan": { label: "Detail Keuangan", group: "Financial" },
    "/outlet/activity-log": { label: "Activity Log", group: "Financial" },
};

export function OutletHeader() {
    const pathname = usePathname();
    const route = routeMap[pathname];
    const { data: response } = useOutletDashboard();
    
    const [readAlerts, setReadAlerts] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("qoma_read_alerts");
        if (saved) {
            try {
                setReadAlerts(JSON.parse(saved));
            } catch (e) {}
        }
    }, []);

    const handleMarkAlertRead = (alertId: string) => {
        if (!readAlerts.includes(alertId)) {
            const newReadAlerts = [...readAlerts, alertId];
            setReadAlerts(newReadAlerts);
            localStorage.setItem("qoma_read_alerts", JSON.stringify(newReadAlerts));
        }
    };

    const handleMarkAllAlertsRead = (alertIds: string[]) => {
        const newReadAlerts = Array.from(new Set([...readAlerts, ...alertIds]));
        setReadAlerts(newReadAlerts);
        localStorage.setItem("qoma_read_alerts", JSON.stringify(newReadAlerts));
    };

    const alerts = response?.data?.alerts;
    
    const flattenedAlerts = [
        ...(alerts?.sudah_expired?.map((a: any) => ({ ...a, type: 'sudah_expired' })) || []),
        ...(alerts?.mendekati_expired?.map((a: any) => ({ ...a, type: 'mendekati_expired' })) || []),
        ...(alerts?.stok_menipis?.map((a: any) => ({ ...a, type: 'stok_menipis' })) || [])
    ];

    const extraNotifications = flattenedAlerts.map((alert, index) => {
        const id = `alert-${alert.type}-${alert.bahan}-${index}`;
        return {
            id,
            title: alert.type === 'stok_menipis' ? 'Peringatan Stok' : 'Peringatan Kedaluwarsa',
            message: alert.pesan,
            is_read: readAlerts.includes(id),
            created_at: new Date().toISOString(),
            type: alert.type,
        };
    });

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
                    <HeaderActions 
                        extraNotifications={extraNotifications} 
                        onMarkAlertRead={handleMarkAlertRead}
                        onMarkAllAlertsRead={() => handleMarkAllAlertsRead(extraNotifications.map(n => n.id))}
                    />
                </div>
            </header>
        </>
    );
}