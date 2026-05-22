// ─── Notification Model ───────────────────────────────────────────────────────

export type NotificationType =
  | "payment_confirmed"
  | "payment_pending"
  | "subscription_cancelled"
  | "new_tenant"
  | "general"
  | string; // fallback untuk type baru

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  data: Record<string, unknown> | null; // flexible — isi bebas dari BE
  read_at: string | null; // null = belum dibaca
  created_at: string;
  updated_at: string;
}

// ─── Response shapes ──────────────────────────────────────────────────────────

export interface NotificationListResponse {
  message: string;
  data: Notification[];
  unread_count: number;
}

export interface NotificationActionResponse {
  message: string;
  data: Notification;
}
