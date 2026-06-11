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

export interface StockOpnameSession {
  id: string;
  outlet_id: string;
  tanggal: string;
  status: "open" | "closed";
  closed_at: string | null;
  created_at: string;
  total_item?: number;
  total_draft?: number;
  total_final?: number;
  total_kerugian?: number;
  items?: StockOpname[];
}

export interface StockOpnameHistoryResponse {
  data: StockOpnameSession[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const stockOpnameService = {
  // GET /outlet/stock-opname/sesi — info sesi hari ini
  getSesiHariIni: async (): Promise<{ data: StockOpnameSession | null }> => {
    const response = await axiosInstance.get("/outlet/stock-opname/sesi");
    return response.data;
  },

  // GET /outlet/stock-opname/history — history sesi lalu
  getHistorySesi: async (params?: { page?: number }): Promise<StockOpnameHistoryResponse> => {
    const response = await axiosInstance.get("/outlet/stock-opname/history", { params });
    return response.data;
  },

  // POST /outlet/stock-opname/item — tambah/update draft item
  createDraftItem: async (data: FormData) => {
    const response = await axiosInstance.post("/outlet/stock-opname/item", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // PUT /outlet/stock-opname/item/{id} — edit draft item
  updateDraftItem: async (id: string, data: FormData) => {
    data.append('_method', 'PUT');
    const response = await axiosInstance.post(`/outlet/stock-opname/item/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // DELETE /outlet/stock-opname/item/{id} — hapus draft item
  deleteDraftItem: async (id: string) => {
    const response = await axiosInstance.delete(`/outlet/stock-opname/item/${id}`);
    return response.data;
  },

  // POST /outlet/stock-opname/simpan — 1x klik simpan semua (Finalisasi)
  simpanSemua: async () => {
    const response = await axiosInstance.post(`/outlet/stock-opname/simpan`);
    return response.data;
  },

  // POST /outlet/stock-opname/sesi/tutup — tutup sesi
  tutupSesi: async () => {
    const response = await axiosInstance.post(`/outlet/stock-opname/sesi/tutup`);
    return response.data;
  },
};
