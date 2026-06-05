import axiosInstance from "@/lib/axios";
import type { BahanMaster } from "./bahan-baku-service";

export interface StockOpnameItem {
  id: string;
  stock_opname_id: string;
  bahan_master_id: string;
  kondisi_stock: string;
  stock_ril: number;
  recent_stock: number;
  stock_hilang: number;
  foto_bukti: string | null;
  bahan_master: BahanMaster;
  created_at: string;
}

export interface StockOpname {
  id: string;
  outlet_id: string;
  status: "pending" | "reviewing" | "approved";
  created_at: string;
  items_count?: number;
  items?: StockOpnameItem[];
}

export interface StockOpnameListResponse {
  data: StockOpname[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const stockOpnameService = {
  getList: async (params?: {
    page?: number;
    sort_by?: string;
    sort_dir?: string;
  }): Promise<StockOpnameListResponse> => {
    const response = await axiosInstance.get("/outlet/stock-opname", { params });
    return response.data;
  },

  create: async () => {
    const response = await axiosInstance.post("/outlet/stock-opname");
    return response.data;
  },

  getDetail: async (id: string): Promise<{ data: StockOpname }> => {
    const response = await axiosInstance.get(`/outlet/stock-opname/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await axiosInstance.patch(`/outlet/stock-opname/${id}/status`, { status });
    return response.data;
  },

  addItem: async (id: string, data: FormData) => {
    const response = await axiosInstance.post(`/outlet/stock-opname/${id}/items`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  deleteItem: async (id: string, itemId: string) => {
    const response = await axiosInstance.delete(`/outlet/stock-opname/${id}/items/${itemId}`);
    return response.data;
  },
};
