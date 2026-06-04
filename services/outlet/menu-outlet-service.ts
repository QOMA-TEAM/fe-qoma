import axiosInstance from "@/lib/axios";
import type { PesananResponse } from "./pesanan-service";

export interface OutletMenu {
  id: string;
  nama: string;
  deskripsi: string | null;
  harga: number;
  tipe: string;
  is_available: boolean;
  kategori: {
    id: string;
    nama: string;
  } | null;
  addons: any[]; // Bisa didetailkan jika diperlukan
}

export interface OutletMenuResponse {
  message: string;
  data: OutletMenu[];
}

export const menuOutletService = {
  getList: async (): Promise<OutletMenuResponse> => {
    const response = await axiosInstance.get("/outlet/menu");
    return response.data;
  }
};
