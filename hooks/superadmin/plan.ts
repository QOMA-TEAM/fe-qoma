// ============================================================
// types/superadmin/plan.ts  — satu-satunya sumber kebenaran
// ============================================================

// Status — samakan dengan value yang diterima / dikirim backend
export type PlanStatus = "aktif" | "tidak aktif";

// Tagihan label yang tampil di UI
export type PlanTagihan = "30 Hari" | "60 Hari" | "90 Hari" | "365 Hari";

// Map label → angka hari (dipakai saat kirim ke backend)
export const TAGIHAN_TO_HARI: Record<PlanTagihan, number> = {
    "30 Hari": 30,
    "60 Hari": 60,
    "90 Hari": 90,
    "365 Hari": 365,
};

// Map angka hari → label (dipakai saat terima dari backend)
export const HARI_TO_TAGIHAN: Record<number, PlanTagihan> = {
    30: "30 Hari",
    60: "60 Hari",
    90: "90 Hari",
    365: "365 Hari",
};

// ─── Shape data Plan dari backend ────────────────────────────
export interface Plan {
    id: string;
    nama_plan: string;
    harga: number;
    /**
     * Backend mengembalikan durasi dalam bentuk angka hari (30, 60, 90, 365).
     * Konversi ke PlanTagihan dilakukan di helper normalizePlan().
     */
    durasi_hari: number;
    /**
     * Label yang sudah dinormalisasi untuk UI — diisi oleh normalizePlan().
     * Tidak berasal langsung dari API.
     */
    tagihan: PlanTagihan;
    batas_outlet: number;
    deskripsi?: string | null;
    status: PlanStatus;
    subscriptions_count?: number;
    created_at?: string;
    updated_at?: string;
}

// ─── Payload kirim ke backend ─────────────────────────────────
export interface CreatePlanPayload {
    nama_plan: string;
    harga: number;
    durasi_hari: number;        // angka murni, misal 30 / 365
    batas_outlet: number;
    deskripsi?: string | null;
    status: PlanStatus;         // "aktif" | "tidak aktif"
}

export type UpdatePlanPayload = Partial<CreatePlanPayload>;

// ─── Response shapes ──────────────────────────────────────────
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

// ─── Helper: normalisasi data mentah dari API ─────────────────
/**
 * Backend bisa mengembalikan durasi_hari sebagai number ATAU
 * field "tagihan" sebagai string angka / label lama.
 * Fungsi ini memastikan objek Plan selalu punya tagihan yang valid.
 */
export function normalizePlan(raw: any): Plan {
    // Coba baca durasi dari berbagai kemungkinan field
    const hari: number =
        typeof raw.durasi_hari === "number"
            ? raw.durasi_hari
            : typeof raw.tagihan === "number"
                ? raw.tagihan
                : parseInt(String(raw.tagihan ?? raw.durasi_hari ?? "30"), 10) || 30;

    // Cari label terdekat jika tidak exact match
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