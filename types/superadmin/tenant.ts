// ─── Plan Types ──────────────────────────────────────────────────────────────

export type PlanStatus = "active" | "inactive";
export type PlanTagihan = "30 Hari" | "60 Hari" | "90 Hari" | "365 Hari";

export interface Plan {
  id: string;
  nama_plan: string;
  harga: number;
  batas_outlet: number;
  tagihan: PlanTagihan;
  status: PlanStatus;
  deskripsi?: string;
  created_at: string;
  updated_at: string;
}

// ─── API Payloads ─────────────────────────────────────────────────────────────

export interface CreatePlanPayload {
  nama_plan: string;
  harga: number;
  batas_outlet: number;
  tagihan: PlanTagihan;
  status: PlanStatus;
  deskripsi?: string;
}

export interface UpdatePlanPayload extends Partial<CreatePlanPayload> {}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface PlanListResponse {
  message: string;
  data: Plan[];
}

export interface PlanDetailResponse {
  message: string;
  data: Plan;
}

export interface PlanDeleteResponse {
  message: string;
}
