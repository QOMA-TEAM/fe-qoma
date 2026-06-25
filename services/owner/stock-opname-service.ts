import axiosInstance from "@/lib/axios";
import { StockOpnameHistoryResponse } from "@/services/outlet/stock-opname-service";

export const ownerStockOpnameService = {
  getHistory: async (page: number = 1, outletId?: string): Promise<StockOpnameHistoryResponse> => {
    const params = new URLSearchParams({ page: page.toString() });
    if (outletId) {
      params.append('outlet_id', outletId);
    }
    const response = await axiosInstance.get(`/owner/stock-opname?${params.toString()}`);
    return response.data;
  },
};
