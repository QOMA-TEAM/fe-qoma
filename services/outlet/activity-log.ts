import api from "@/lib/axios"
export interface PaginatedResponse<T> {
  message: string;
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
  };
}

export interface ActivityLog {
  id: string;
  aktivitas: string;
  deskripsi: string;
  metadata: any;
  ip_address: string;
  created_at: string;
  user?: {
    id: string;
    username: string;
    nama_lengkap: string;
  };
}

export const activityLogOutletService = {
  getLogs: async (
    page: number = 1,
    search?: string,
    aktivitas?: string,
    dari?: string,
    sampai?: string,
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

    const response = await api.get(`/outlet/activity-log?${params.toString()}`);
    return response.data;
  },
};
