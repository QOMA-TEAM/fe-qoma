import api from "@/lib/axios";
import {
    CreatePlanPayload,
    PlanDeleteResponse,
    PlanDetailResponse,
    PlanListResponse,
    UpdatePlanPayload,
} from "@/types/superadmin/plan";

export const planService = {
    /**
     * Ambil semua plan subscription
     */
    getAll: async (): Promise<PlanListResponse> => {
        const res = await api.get("/super-admin/plans");
        return res.data;
    },

    /**
     * Detail satu plan
     */
    getById: async (id: string): Promise<PlanDetailResponse> => {
        const res = await api.get(`/super-admin/plans/${id}`);
        return res.data;
    },

    /**
     * Tambah plan baru
     */
    create: async (payload: CreatePlanPayload): Promise<PlanDetailResponse> => {
        const res = await api.post("/super-admin/plans", payload);
        return res.data;
    },

    /**
     * Update plan
     */
    update: async (
        id: string,
        payload: UpdatePlanPayload,
    ): Promise<PlanDetailResponse> => {
        const res = await api.put(`/super-admin/plans/${id}`, payload);
        return res.data;
    },

    /**
     * Hapus plan
     */
    delete: async (id: string): Promise<PlanDeleteResponse> => {
        const res = await api.delete(`/super-admin/plans/${id}`);
        return res.data;
    },
};
