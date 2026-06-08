import axiosInstance from "@/lib/axios";
import type { BahanMaster } from "./bahan-baku-service";

export interface StockOpname {
  id: string;
  outlet_id: string;
  bahan_master_id: string;
  tipe: "busuk" | "rusak" | "ga_layak" | "hilang";
  jumlah: number;
  keterangan: string | null;
  status: "draft" | "final";
  foto_bukti: string | null;
  created_at: string;
  bahan_master?: BahanMaster;
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
  // GET /outlet/stock-opname — list semua (draft + final)
  getList: async (params?: {
    page?: number;
    status?: string;
  }): Promise<StockOpnameListResponse> => {
    const response = await axiosInstance.get("/outlet/stock-opname", { params });
    return response.data;
  },

  // GET /outlet/stock-opname/draft — list draft
  getDraftList: async (): Promise<{ data: StockOpname[], total: number }> => {
    const response = await axiosInstance.get("/outlet/stock-opname/draft");
    return response.data;
  },

  // POST /outlet/stock-opname/draft — buat draft
  createDraft: async (data: FormData) => {
    const response = await axiosInstance.post("/outlet/stock-opname/draft", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // PUT /outlet/stock-opname/draft/{id} — edit draft (using POST + _method=PUT)
  updateDraft: async (id: string, data: FormData) => {
    data.append('_method', 'PUT');
    const response = await axiosInstance.post(`/outlet/stock-opname/draft/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // DELETE /outlet/stock-opname/draft/{id} — hapus draft
  deleteDraft: async (id: string) => {
    const response = await axiosInstance.delete(`/outlet/stock-opname/draft/${id}`);
    return response.data;
  },

  // POST /outlet/stock-opname/draft/{id}/final — finalisasi draft
  finalizeDraft: async (id: string) => {
    const response = await axiosInstance.post(`/outlet/stock-opname/draft/${id}/final`);
    return response.data;
  },
};
