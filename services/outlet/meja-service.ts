import axiosInstance from "@/lib/axios";

export interface Meja {
  id: string;
  outlet_id: string;
  nomor_meja: string;
  qr_code: string | null;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface MejaResponse {
  message: string;
  data: Meja[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export const mejaService = {
  getList: async (page: number = 1, search: string = ""): Promise<MejaResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(search && { search }),
    });
    const response = await axiosInstance.get(`/outlet/meja?${params.toString()}`);
    return response.data;
  },

  create: async (nomorMeja: string) => {
    const response = await axiosInstance.post("/outlet/meja", {
      nomor_meja: nomorMeja,
    });
    return response.data;
  },

  update: async (id: string, nomorMeja?: string, status?: string) => {
    const response = await axiosInstance.patch(`/outlet/meja/${id}`, {
      ...(nomorMeja && { nomor_meja: nomorMeja }),
      ...(status && { status }),
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(`/outlet/meja/${id}`);
    return response.data;
  },
};
