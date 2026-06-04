import axiosInstance from "@/lib/axios";

export interface PesananDetail {
  id: string;
  menu_id: string;
  nama: string;
  qty: number;
  harga: number;
  subtotal: number;
  addons?: Array<{
    id: string;
    nama: string;
    qty: number;
    harga: number;
    subtotal: number;
  }>;
}

export interface Pembayaran {
  metode: string;
  jumlah_bayar: number;
  paid_at: string;
}

export interface Pesanan {
  id: string;
  nomor_meja: string;
  nama_pelanggan: string;
  no_telp: string | null;
  total_harga: number;
  status: "pending" | "confirmed" | "paid" | "cancelled" | "expired";
  status_label: string;
  created_at: string;
  items?: PesananDetail[];
  pembayaran?: Pembayaran | null;
}

export interface PesananResponse {
  message: string;
  data: Pesanan;
}

export interface PesananListResponse {
  message: string;
  data: Pesanan[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const pesananService = {
  getList: async (status?: string): Promise<PesananListResponse> => {
    const response = await axiosInstance.get("/outlet/pesanan", {
      params: { status },
    });
    return response.data;
  },

  getDetail: async (id: string): Promise<PesananResponse> => {
    const response = await axiosInstance.get(`/outlet/pesanan/${id}`);
    return response.data;
  },

  konfirmasi: async (id: string): Promise<PesananResponse> => {
    const response = await axiosInstance.post(`/outlet/pesanan/${id}/konfirmasi`);
    return response.data;
  },

  bayar: async (id: string, metode: "tunai" | "transfer" | "qris"): Promise<PesananResponse> => {
    const response = await axiosInstance.post(`/outlet/pesanan/${id}/bayar`, { metode });
    return response.data;
  },

  cancel: async (id: string): Promise<PesananResponse> => {
    const response = await axiosInstance.post(`/outlet/pesanan/${id}/cancel`);
    return response.data;
  },

  tambahItem: async (id: string, items: Array<{ menu_id: string; qty: number }>): Promise<PesananResponse> => {
    const response = await axiosInstance.post(`/outlet/pesanan/${id}/tambah-item`, { items });
    return response.data;
  },

  updateQty: async (id: string, detailId: string, qty: number): Promise<PesananResponse> => {
    const response = await axiosInstance.patch(`/outlet/pesanan/${id}/item/${detailId}/qty`, { qty });
    return response.data;
  },

  hapusItem: async (id: string, detailId: string): Promise<PesananResponse> => {
    const response = await axiosInstance.delete(`/outlet/pesanan/${id}/item/${detailId}`);
    return response.data;
  },
};
