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

export const publicOrderService = {
  submitOrder: async (payload: OrderPayload) => {
    const { data } = await api.post<OrderResponse>(`/public/pesanan`, payload)
    return data
  }
}
