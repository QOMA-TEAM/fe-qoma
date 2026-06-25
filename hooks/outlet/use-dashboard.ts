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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: OUTLET_DASHBOARD_QUERY_KEY });
      const previousData = queryClient.getQueryData(OUTLET_DASHBOARD_QUERY_KEY);

      queryClient.setQueryData(OUTLET_DASHBOARD_QUERY_KEY, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            outlet: {
              ...old.data.outlet,
              status_buka: !old.data.outlet.status_buka,
            },
          },
        };
      });

      return { previousData };
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: any, variables, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(OUTLET_DASHBOARD_QUERY_KEY, context.previousData);
      }
      const msg = error.response?.data?.message || "Gagal mengubah status outlet";
      toast.error(msg);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: OUTLET_DASHBOARD_QUERY_KEY });
    },
  });
}

export function useUpdateOutletGambar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: outletDashboardService.updateGambar,
    onSuccess: (data) => {
      toast.success(data.message);
      // Update the cache with new image URLs
      queryClient.setQueryData(OUTLET_DASHBOARD_QUERY_KEY, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            outlet: {
              ...old.data.outlet,
              gambar_icon: data.gambar_icon,
              gambar_header: data.gambar_header,
            },
          },
        };
      });
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Gagal mengupdate gambar outlet";
      toast.error(msg);
    },
  });
}
