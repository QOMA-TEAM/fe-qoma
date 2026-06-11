import { useQuery } from "@tanstack/react-query";
import { ownerStockOpnameService } from "@/services/owner/stock-opname-service";

export const useOwnerStockOpnameHistory = (page: number, outletId?: string) => {
  return useQuery({
    queryKey: ["owner-stock-opname", page, outletId],
    queryFn: () => ownerStockOpnameService.getHistory(page, outletId),
    placeholderData: (previousData) => previousData,
  });
};
