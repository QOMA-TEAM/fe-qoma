// types/superadmin/plan.ts

export type PlanStatus = "aktif" | "tidak aktif";
export type PlanTagihan = "30 Hari" | "60 Hari" | "90 Hari" | "365 Hari";

export const TAGIHAN_TO_HARI: Record<PlanTagihan, number> = {
  "30 Hari": 30,
  "60 Hari": 60,
  "90 Hari": 90,
  "365 Hari": 365,
};

export const HARI_TO_TAGIHAN: Record<number, PlanTagihan> = {
  30: "30 Hari",
  60: "60 Hari",
  90: "90 Hari",
  365: "365 Hari",
};

export interface Plan {
  id: string;
  nama_plan: string;
  harga: number;
  durasi_hari: number;
  tagihan: PlanTagihan;
  batas_outlet: number;
  deskripsi?: string | null;
  status: PlanStatus;
  subscriptions_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePlanPayload {
  nama_plan: string;
  harga: number;
  durasi_hari: number;
  batas_outlet: number;
  deskripsi?: string | null;
  status: PlanStatus;
}

export type UpdatePlanPayload = Partial<CreatePlanPayload>;

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

export function normalizePlan(raw: any): Plan {
  const hari: number =
    typeof raw.durasi_hari === "number"
      ? raw.durasi_hari
      : typeof raw.tagihan === "number"
        ? raw.tagihan
        : parseInt(String(raw.tagihan ?? raw.durasi_hari ?? "30"), 10) || 30;

  const tagihan: PlanTagihan =
    HARI_TO_TAGIHAN[hari] ??
    (Object.entries(TAGIHAN_TO_HARI).find(
      ([, v]) => v === hari,
    )?.[0] as PlanTagihan) ??
    "30 Hari";

  return {
    ...raw,
    durasi_hari: hari,
    tagihan,
    status: raw.status ?? "aktif",
  } as Plan;
}