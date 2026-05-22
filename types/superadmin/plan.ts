// src/services/superadmin/plan.ts (atau sesuaikan dengan letak folder kamu)
import axios from "axios";

// ==========================================
// 1. INTERFACE UNTUK RESPONSE (Data dari Server)
// ==========================================

export interface SuperAdminPlan {
  id: string;
  nama_plan: string;
  harga: number;
  tagihan: string; // Misal: "Bulanan", "Tahunan", atau bisa disamakan dengan durasi_hari
  batas_outlet: number | "Unlimited";
  deskripsi: string | null;
  status: "aktif" | "tidak aktif"; // Penambahan status
  subscriptions_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SuperAdminPlanListResponse {
  message: string;
  data: SuperAdminPlan[];
}

export interface SuperAdminPlanDetailResponse {
  message: string;
  data: SuperAdminPlan;
}

// ==========================================
// 2. INTERFACE UNTUK REQUEST (Kirim Data ke Server)
// ==========================================

// Tipe data saat Superadmin menekan tombol "Simpan" di form Create Plan baru
export interface CreatePlanPayload {
  nama_plan: string;
  harga: number;
  tagihan: string;
  durasi_hari?: number;
  batas_outlet: number | "Unlimited";
  deskripsi: string | null;
  status: "aktif" | "tidak aktif";
}

// Tipe data saat Superadmin melakukan Edit (semua field bersifat opsional / bisa diubah sebagian)
export interface UpdatePlanPayload extends Partial<CreatePlanPayload> {}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getPlans = async (): Promise<SuperAdminPlanListResponse> => {
  const response =
    await api.get<SuperAdminPlanListResponse>("/superadmin/plan");
  return response.data;
};

export const getPlanById = async (
  id: string,
): Promise<SuperAdminPlanDetailResponse> => {
  const response = await api.get<SuperAdminPlanDetailResponse>(
    `/superadmin/plan/${id}`,
  );
  return response.data;
};

export const createPlan = async (
  payload: CreatePlanPayload,
): Promise<SuperAdminPlanDetailResponse> => {
  const response = await api.post<SuperAdminPlanDetailResponse>(
    "/superadmin/plan",
    payload,
  );
  return response.data;
};

export const updatePlan = async (
  id: string,
  payload: UpdatePlanPayload,
): Promise<SuperAdminPlanDetailResponse> => {
  const response = await api.put<SuperAdminPlanDetailResponse>(
    `/superadmin/plan/${id}`,
    payload,
  );
  return response.data;
};

export const deletePlan = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(
    `/superadmin/plan/${id}`,
  );
  return response.data;
};
