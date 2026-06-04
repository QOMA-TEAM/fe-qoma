import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/superadmin/dashboardServices";
import type { MRRFilter } from "@/types/superadmin/dashboard";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["superadmin-dashboard-stats"],
    queryFn: async () => {
      const response = await dashboardService.getStats();
      return response.data;
    },
  });
};

export const useDashboardMRR = (filter: MRRFilter = "monthly") => {
  return useQuery({
    queryKey: ["superadmin-dashboard-mrr", filter],
    queryFn: async () => {
      const response = await dashboardService.getMRR(filter);
      return response.data;
    },
  });
};
