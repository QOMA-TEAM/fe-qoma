import axiosInstance from "@/lib/axios";

export interface BahanBakuMenu {
  nama: string;
  satuan: string;
}

export interface OutletMenu {
  id: string;
  nama: string;
  kategori: string;
  kategori_id: string;
  harga: number;
  gambar: string | null;
  keterangan: string | null;
  is_available: boolean;
  bahan_baku: BahanBakuMenu[];
}

export interface OutletMenuResponse {
  message: string;
  outlet: { id: string; nama_outlet: string };
  kategoris: { id: string; nama: string }[];
  data: OutletMenu[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export const menuOutletService = {
  getList: async (page: number = 1, search: string = "", kategoriId: string = ""): Promise<OutletMenuResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(search && { search }),
      ...(kategoriId && { kategori_id: kategoriId }),
    });
    const response = await axiosInstance.get(`/outlet/menu?${params.toString()}`);
    return response.data;
  },

  updateAvailability: async (menuId: string, isAvailable: boolean) => {
    const response = await axiosInstance.patch(`/outlet/menu/${menuId}/availability`, {
      is_available: isAvailable
    });
    return response.data;
  },

  ajukanPerubahanHarga: async (menuId: string, hargaBaru: number, alasan: string) => {
    const response = await axiosInstance.post(`/outlet/approval-harga`, {
      menu_id: menuId,
      harga_baru: hargaBaru,
      alasan: alasan
    });
    return response.data;
  }
};
