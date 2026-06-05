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
        const response = await api.get("/super-admin/subscriptions", {
            params: { ...filters, per_page: perPage },
        });
        return response.data;
    },

    detail: async (id: string): Promise<SubscriptionDetailResponse> => {
        const response = await api.get(`/super-admin/subscriptions/${id}`);
        return response.data;
    },

    konfirmasiPembayaran: async (
        id: string,
    ): Promise<SubscriptionActionResponse> => {
        const response = await api.post(`/super-admin/subscriptions/${id}/konfirmasi-pembayaran`);
        return response.data;
    },

    cancel: async (
        id: string,
        payload: CancelSubscriptionPayload,
    ): Promise<SubscriptionActionResponse> => {
        const response = await api.post(
            `/super-admin/subscriptions/${id}/cancel`,
            payload,
        );
        return response.data;
    },
};
