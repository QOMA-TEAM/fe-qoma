// ─── getStats() ──────────────────────────────────────────────────────────────

export interface DashboardRingkasan {
  total_usaha: number;
  total_outlet: number;
  total_pendapatan_subscription: number;
  total_pendapatan_bulan_ini: number;
  total_owner: number;
}

export interface UsahaByStatus {
  pending: number;
  active: number;
  suspended: number;
  rejected: number;
}

export interface SubscriptionByPlan {
  nama_plan: string;
  total: number;
  pendapatan: string; // SUM dari DB dikembalikan sebagai string
}

export interface PendingApprovalOwner {
  id: string;
  username: string;
  nama_lengkap: string;
  email: string;
}

export interface PendingApproval {
  id: string;
  nama_usaha: string;
  email: string;
  owner_id: string;
  created_at: string;
  owner: PendingApprovalOwner;
}

export interface RecentActivityUser {
  id: string;
  username: string;
}

export interface RecentActivity {
  id: string;
  user_id: string;
  aktivitas: string;
  deskripsi: string;
  created_at: string;
  user: RecentActivityUser;
}

export interface DashboardStatsResponse {
  message: string;
  data: {
    ringkasan: DashboardRingkasan;
    usaha_by_status: UsahaByStatus;
    subscription_by_plan: SubscriptionByPlan[];
    pending_approvals: PendingApproval[];
    recent_activities: RecentActivity[];
  };
}

// ─── getMRR() ────────────────────────────────────────────────────────────────

export type MRRFilter = "daily" | "weekly" | "monthly";

export interface MRRDataPoint {
  tanggal?: string; // format: 'YYYY-MM-DD' — daily & weekly
  bulan?: string; // format: 'YYYY-MM'    — monthly
  total: string; // SUM dari DB, cast ke number saat dipakai
  jumlah_subscriber: number;
}

export interface MRRResponse {
  message: string;
  data: {
    filter: MRRFilter;
    label: "30 Hari Terakhir" | "7 Hari Terakhir" | "12 Bulan Terakhir";
    data: MRRDataPoint[];
  };
}
