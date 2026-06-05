// ─── Shared / Reusable ───────────────────────────────────────────────────────

export type SubscriptionStatus = "pending" | "active" | "cancelled" | "expired";

// ─── list() ──────────────────────────────────────────────────────────────────

export interface SubscriptionPlan {
  id: string;
  nama_plan: string;
  harga: string; // decimal dari DB
  batas_outlet: number;
}

export interface SubscriptionOwner {
  id: string;
  username: string;
  nama_lengkap: string;
  email: string;
}

export interface SubscriptionOutlet {
  id: string;
  usaha_id: string;
}

export interface SubscriptionUsaha {
  id: string;
  nama_usaha: string;
  email: string;
  alamat: string;
  owner_id: string;
  owner: SubscriptionOwner;
  outlets: SubscriptionOutlet[];
}

export interface Subscription {
  id: string;
  plan_id: string;
  usaha_id: string;
  status: SubscriptionStatus;
  start_date: string;
  created_at: string;
  updated_at: string;
  plan: SubscriptionPlan;
  usaha: SubscriptionUsaha;
}

export interface SubscriptionListFilters {
  status?: SubscriptionStatus;
  plan_id?: string;
  dari?: string; // format: 'YYYY-MM-DD'
  sampai?: string; // format: 'YYYY-MM-DD'
  search?: string; // filter by nama_usaha
}

export interface PaginatedSubscriptionResponse {
  message: string;
  data: Subscription[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
}

// ─── detail() ────────────────────────────────────────────────────────────────

export interface SubscriptionDetailPlan {
  id: string;
  nama_plan: string;
  harga: string;
  batas_outlet: number;
  deskripsi: string | null;
}

export interface SubscriptionDetailInfo {
  subscription_id: string;
  plan_id: string;
  start_date: string;
  status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
  plan: SubscriptionDetailPlan;
}

export interface SubscriptionDetailOwner {
  nama: string;
  username: string;
  email: string;
}

export interface SubscriptionDetailUsaha {
  nama_perusahaan: string;
  email: string;
  alamat: string;
  total_outlet: number;
  owner: SubscriptionDetailOwner;
}

export interface SubscriptionDetailResponse {
  detail_subscription: SubscriptionDetailInfo;
  detail_usaha: SubscriptionDetailUsaha;
}

// ─── konfirmasiPembayaran() & cancel() ───────────────────────────────────────

export interface SubscriptionActionResponse {
  message: string;
  data: Subscription;
}

export interface CancelSubscriptionPayload {
  alasan: string;
}
