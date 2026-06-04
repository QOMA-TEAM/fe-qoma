import { HeaderActions } from "../dashboard/header-actions";
import { Store, Loader2 } from "lucide-react";
import { useOutletDashboard, useToggleOutletStatus } from "@/hooks/outlet/use-dashboard";

export function OutletHeader() {
    const { data: dashboardData, isLoading } = useOutletDashboard();
    const { mutate: toggleStatus, isPending } = useToggleOutletStatus();

    const isOpen = dashboardData?.data?.outlet?.status_buka ?? false;

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
            <h2 className="text-[#1E293B] text-[15px] font-bold">Outlet</h2>
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => toggleStatus()}
                    disabled={isLoading || isPending}
                    className={`flex items-center justify-center size-9 rounded-full border transition-colors cursor-pointer ${isOpen
                            ? "border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
                            : "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
                        }`}
                    title={isOpen ? "Outlet Sedang Buka (Klik untuk Tutup)" : "Outlet Sedang Tutup (Klik untuk Buka)"}
                >
                    {isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : (
                        <Store className="size-4" />
                    )}
                </button>
                <HeaderActions />
            </div>
        </header>
    );
}