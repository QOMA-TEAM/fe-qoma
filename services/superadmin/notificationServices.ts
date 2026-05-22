import api from "@/lib/axios";
import type {
  NotificationListResponse,
  NotificationActionResponse,
} from "@/types/superadmin/notification";

/**
 * Service FE untuk membaca notifikasi.
 * BE yang membuat notifikasi (NotificationService.php) — FE hanya membaca.
 */
export const notificationService = {
  /**
   * Ambil semua notifikasi milik user yang sedang login
   * GET /notifications
   */
  getAll: async (): Promise<NotificationListResponse> => {
    const response = await api.get("/notifications");
    return response.data;
  },

  /**
   * Tandai 1 notifikasi sebagai sudah dibaca
   * PATCH /notifications/:id/read
   */
  markAsRead: async (id: string): Promise<NotificationActionResponse> => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  /**
   * Tandai semua notifikasi sebagai sudah dibaca
   * PATCH /notifications/read-all
   */
  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await api.patch("/notifications/read-all");
    return response.data;
  },
};
