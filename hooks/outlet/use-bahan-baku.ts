import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bahanBakuService } from "@/services/outlet/bahan-baku-service";
import { toast } from "sonner";

export const BAHAN_BAKU_OUTLET_QUERY_KEY = "bahan-baku-outlet-list";

export function useBahanBakuList(page: number = 1, search: string = "") {
  return useQuery({
    queryKey: [BAHAN_BAKU_OUTLET_QUERY_KEY, page, search],
    queryFn: () => bahanBakuService.getList({ page, search }),
    placeholderData: (previousData) => previousData, // keep previous data while fetching new page
  });
}

export const BAHAN_MASTER_QUERY_KEY = "bahan-master-list";

export function useBahanMasterList(page: number = 1, search: string = "") {
  return useQuery({
    queryKey: [BAHAN_MASTER_QUERY_KEY, page, search],
    queryFn: () => bahanBakuService.getMasterList({ page, search }),
    placeholderData: (previousData) => previousData,
  });
}

export function useRestockBahanBaku() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bahanBakuService.restock,
    onSuccess: (data) => {
      toast.success(data.message || "Bahan baku berhasil direstock!");
      queryClient.invalidateQueries({ queryKey: [BAHAN_BAKU_OUTLET_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal melakukan restock bahan baku");
    },
  });
}
