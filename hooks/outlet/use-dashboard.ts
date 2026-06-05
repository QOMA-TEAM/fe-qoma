import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { outletDashboardService } from "@/services/outlet/dashboard-service";
import { toast } from "sonner";

export const OUTLET_DASHBOARD_QUERY_KEY = ["outletDashboard"];

export function useOutletDashboard() {
  return useQuery({
    queryKey: OUTLET_DASHBOARD_QUERY_KEY,
    queryFn: outletDashboardService.getDashboard,
    staleTime: 1000 * 60 * 5, // 5 menit cache
    refetchOnWindowFocus: true, // Auto refetch saat window aktif agar data selalu update
  });
}

export function useToggleOutletStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: outletDashboardService.toggleStatus,
    onSuccess: (data) => {
      toast.success(data.message);
      // Invalidate query agar komponen dashboard me-refresh profil/status terbaru
      queryClient.invalidateQueries({ queryKey: OUTLET_DASHBOARD_QUERY_KEY });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Gagal mengubah status outlet";
      toast.error(msg);
    },
  });
}
