import api from "@/lib/axios";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  type: string;
  data: any;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const notificationService = {
  getNotifications: async (page: number = 1, perPage: number = 10): Promise<PaginatedResponse<Notification>> => {
    const response = await api.get(`/shared/notifications?page=${page}&per_page=${perPage}`);
    return response.data;
  },

  getUnreadCount: async (): Promise<{ unread_count: number }> => {
    const response = await api.get(`/shared/notifications/unread-count`);
    return response.data.data;
  },

  markAsRead: async (id: string): Promise<void> => {
    await api.patch(`/shared/notifications/${id}/read`);
  },

  markAllAsRead: async (): Promise<void> => {
    await api.patch(`/shared/notifications/read-all`);
  },
};
