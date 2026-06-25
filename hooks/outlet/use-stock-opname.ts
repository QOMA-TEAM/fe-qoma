import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { stockOpnameService } from "@/services/outlet/stock-opname-service";
import { toast } from "sonner";
import { BAHAN_BAKU_OUTLET_QUERY_KEY } from "./use-bahan-baku";

export const STOCK_OPNAME_SESI_KEY = "stock-opname-sesi";
export const STOCK_OPNAME_HISTORY_KEY = "stock-opname-history";

export function useSesiHariIni() {
  return useQuery({
    queryKey: [STOCK_OPNAME_SESI_KEY],
    queryFn: () => stockOpnameService.getSesiHariIni(),
  });
}

export function useHistorySesi(page: number = 1) {
  return useQuery({
    queryKey: [STOCK_OPNAME_HISTORY_KEY, page],
    queryFn: () => stockOpnameService.getHistorySesi({ page }),
    placeholderData: (previousData) => previousData,
  });
}

export function useTambahItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stockOpnameService.createDraftItem,
    onSuccess: (data) => {
      toast.success(data.message || "Item berhasil ditambahkan ke sesi!");
      queryClient.invalidateQueries({ queryKey: [STOCK_OPNAME_SESI_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menambahkan item");
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      stockOpnameService.updateDraftItem(id, data),
    onSuccess: (data) => {
      toast.success(data.message || "Item berhasil diupdate!");
      queryClient.invalidateQueries({ queryKey: [STOCK_OPNAME_SESI_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal mengupdate item");
    },
  });
}

export function useHapusItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stockOpnameService.deleteDraftItem,
    onSuccess: (data) => {
      toast.success(data.message || "Item berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: [STOCK_OPNAME_SESI_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus item");
    },
  });
}

export function useSimpanSemua() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stockOpnameService.simpanSemua,
    onSuccess: (data) => {
      toast.success(data.message || "Sesi berhasil disimpan (difinalisasi)!");
      queryClient.invalidateQueries({ queryKey: [STOCK_OPNAME_SESI_KEY] });
      queryClient.invalidateQueries({ queryKey: [STOCK_OPNAME_HISTORY_KEY] });
      queryClient.invalidateQueries({ queryKey: [BAHAN_BAKU_OUTLET_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memfinalisasi sesi");
    },
  });
}

export function useTutupSesi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stockOpnameService.tutupSesi,
    onSuccess: (data) => {
      toast.success(data.message || "Sesi hari ini berhasil ditutup!");
      queryClient.invalidateQueries({ queryKey: [STOCK_OPNAME_SESI_KEY] });
      queryClient.invalidateQueries({ queryKey: [STOCK_OPNAME_HISTORY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menutup sesi");
    },
  });
}
