import api from "@/lib/axios";
import type {
  PaginatedSubscriptionResponse,
  SubscriptionDetailResponse,
  SubscriptionActionResponse,
  SubscriptionListFilters,
  CancelSubscriptionPayload,
} from "@/types/superadmin/new-tenant";

export const subscriptionService = {
  list: async (
    filters: SubscriptionListFilters = {},
    perPage = 15,
  ): Promise<PaginatedSubscriptionResponse> => {
    const response = await api.get("/superadmin/new-tenant", {
      params: { ...filters, per_page: perPage },
    });
    return response.data;
  },

  detail: async (id: string): Promise<SubscriptionDetailResponse> => {
    const response = await api.get(`/superadmin/new-tenant/${id}`);
    return response.data;
  },

  konfirmasiPembayaran: async (
    id: string,
  ): Promise<SubscriptionActionResponse> => {
    const response = await api.post(`/superadmin/new-tenant/${id}/konfirmasi`);
    return response.data;
  },

  cancel: async (
    id: string,
    payload: CancelSubscriptionPayload,
  ): Promise<SubscriptionActionResponse> => {
    const response = await api.post(
      `/superadmin/new-tenant/${id}/cancel`,
      payload,
    );
    return response.data;
  },
};
