import api from "@/lib/axios";
import type {
  TenantListResponse,
  TenantDetailResponse,
  TenantActionResponse,
  TenantListFilters,
} from "@/types/superadmin/tenant";

export const tenantService = {
  /**
   * Ambil semua tenant/usaha (paginated)
   */
  list: async (
    filters: TenantListFilters = {},
    perPage = 15,
  ): Promise<TenantListResponse> => {
    const response = await api.get("/super-admin/usaha", {
      params: { ...filters, per_page: perPage },
    });
    return response.data;
  },

  /**
   * Detail satu tenant/usaha
   */
  detail: async (id: string): Promise<TenantDetailResponse> => {
    const response = await api.get(`/super-admin/usaha/${id}`);
    return response.data;
  },

  /**
   * Approve tenant/usaha
   */
  approve: async (id: string): Promise<TenantActionResponse> => {
    const response = await api.post(`/super-admin/usaha/${id}/approve`);
    return response.data;
  },

  /**
   * Reject tenant/usaha
   */
  reject: async (
    id: string,
    alasan: string,
  ): Promise<TenantActionResponse> => {
    const response = await api.post(`/super-admin/usaha/${id}/reject`, {
      alasan,
    });
    return response.data;
  },

  /**
   * Suspend tenant/usaha
   */
  suspend: async (
    id: string,
    catatan?: string,
  ): Promise<TenantActionResponse> => {
    const response = await api.post(`/super-admin/usaha/${id}/suspend`, {
      catatan,
    });
    return response.data;
  },

  /**
   * Unsuspend tenant/usaha
   */
  unsuspend: async (id: string): Promise<TenantActionResponse> => {
    const response = await api.post(`/super-admin/usaha/${id}/unsuspend`);
    return response.data;
  },
};
