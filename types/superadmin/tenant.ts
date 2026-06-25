// ─── Tenant / Usaha Types ────────────────────────────────────────────────────

export type TenantStatus = "pending" | "active" | "approved" | "rejected" | "suspended";

export interface TenantOwner {
  id: string;
  username: string;
  nama_lengkap: string;
  email: string;
  is_active: boolean;
}

export interface TenantSubscriptionPlan {
  id: string;
  nama_plan: string;
  harga: string | number;
}

export interface TenantSubscription {
  plan: TenantSubscriptionPlan | string;
  status: string;
  start_date: string | null;
  end_date: string | null;
}

export interface TenantOutlet {
  id: string;
  nama_outlet: string;
  status_buka: boolean;
}

export interface Tenant {
  id: string;
  nama_usaha: string;
  email: string;
  alamat: string;
  status: TenantStatus;
  catatan_admin: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  outlets_count: number;
  created_at: string;
  owner?: TenantOwner;
  subscription?: TenantSubscription | null;
  outlets?: TenantOutlet[];
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface TenantListFilters {
  status?: TenantStatus;
  exclude_status?: TenantStatus;
  search?: string;
  page?: number;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface TenantListResponse {
  message: string;
  data: Tenant[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
}

export interface TenantDetailResponse {
  message: string;
  data: Tenant;
}

export interface TenantActionResponse {
  message: string;
  data: Tenant;
}
