import api from "@/lib/axios";
import type { PaginatedResponse, ActivityLog } from "@/services/outlet/activity-log";

export const activityLogOwnerService = {
  getLogs: async (
    page: number = 1,
    search?: string,
    aktivitas?: string,
    dari?: string,
    sampai?: string,
    outletId?: string,
    perPage: number = 15
  ): Promise<PaginatedResponse<ActivityLog>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });

    if (search) params.append("search", search);
    if (aktivitas && aktivitas !== "semua") params.append("aktivitas", aktivitas);
    if (dari) params.append("dari", dari);
    if (sampai) params.append("sampai", sampai);
    if (outletId) params.append("outlet_id", outletId);

    const response = await api.get(`/owner/activity-log?${params.toString()}`);
    return response.data;
  },
};
