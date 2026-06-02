// services/superadmin/planService.ts
import api from "@/lib/axios";
import {
  CreatePlanPayload,
  PlanDeleteResponse,
  PlanDetailResponse,
  PlanListResponse,
  UpdatePlanPayload,
  normalizePlan,
} from "@/types/superadmin/plan";

export const planService = {
  /** Ambil semua plan — normalisasi tiap item */
  getAll: async (): Promise<PlanListResponse> => {
    const res = await api.get("/super-admin/plans");
    return {
      ...res.data,
      data: (res.data.data ?? []).map(normalizePlan),
    };
  },

  /** Detail satu plan */
  getById: async (id: string): Promise<PlanDetailResponse> => {
    const res = await api.get(`/super-admin/plans/${id}`);
    return { ...res.data, data: normalizePlan(res.data.data) };
  },

  /** Tambah plan baru */
  create: async (payload: CreatePlanPayload): Promise<PlanDetailResponse> => {
    const res = await api.post("/super-admin/plans", payload);
    return { ...res.data, data: normalizePlan(res.data.data) };
  },

  /** Update plan */
  update: async (
    id: string,
    payload: UpdatePlanPayload,
  ): Promise<PlanDetailResponse> => {
    // Menggunakan POST dengan ?_method=PUT untuk menghindari bug fatal error PHP (request_parse_body) pada method PUT
    const res = await api.post(`/super-admin/plans/${id}?_method=PUT`, payload);
    return { ...res.data, data: normalizePlan(res.data.data) };
  },

  /** Hapus plan */
  delete: async (id: string): Promise<PlanDeleteResponse> => {
    const res = await api.delete(`/super-admin/plans/${id}`);
    return res.data;
  },
};