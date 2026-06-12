import api from "@/lib/axios"

export interface OrderPayload {
  outlet_id: string;
  meja_id: string;
  nama_pelanggan: string;
  no_telp: string;
  tipe_pesanan: "dine_in" | "take_away";
  items: {
    menu_id: string;
    qty: number;
    addons: {
      addon_id: string;
      qty: number;
    }[];
  }[];
}

export interface OrderResponse {
  message: string;
  data: {
    pesanan_id: string;
    nomor_meja: string;
    nama_pelanggan: string;
    no_telp: string;
    total_harga: number;
    status: string;
    pesan: string;
  };
}

export interface OrderDetailItem {
  nama: string;
  qty: number;
  harga: number;
  subtotal: number;
  addons: {
    nama: string;
    qty: number;
    harga: number;
  }[];
}

export interface OrderDetailResponse {
  message: string;
  data: {
    pesanan_id: string;
    nomor_meja: string;
    nama_pelanggan: string;
    no_telp: string;
    status: "pending" | "confirmed" | "paid" | "cancelled" | "expired" | string;
    status_label: string;
    tipe_pesanan: string;
    expired_at: string | null;
    sisa_waktu_detik: number | null;
    is_expired: boolean;
    total_harga: number;
    items: OrderDetailItem[];
    pembayaran: {
      metode: string;
      jumlah_bayar: number;
      paid_at: string;
    } | null;
  };
}

export const publicOrderService = {
  submitOrder: async (payload: OrderPayload) => {
    const { data } = await api.post<OrderResponse>(`/public/pesanan`, payload)
    return data
  },
  
  getPublicOrderDetail: async (pesananId: string, outletId: string) => {
    const { data } = await api.get<OrderDetailResponse>(`/public/pesanan/${pesananId}?outlet_id=${outletId}`)
    return data.data
  },
  
  cancelOrder: async (pesananId: string, outletId: string) => {
    const { data } = await api.post(`/public/pesanan/${pesananId}/cancel`, { outlet_id: outletId })
    return data
  }
}
