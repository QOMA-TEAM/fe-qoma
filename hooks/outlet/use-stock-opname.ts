import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { stockOpnameService } from "@/services/outlet/stock-opname-service";
import { toast } from "sonner";

export const STOCK_OPNAME_QUERY_KEY = "stock-opname-list";
export const STOCK_OPNAME_DETAIL_KEY = "stock-opname-detail";

export function useStockOpnameList(page: number = 1) {
  return useQuery({
    queryKey: [STOCK_OPNAME_QUERY_KEY, page],
    queryFn: () => stockOpnameService.getList({ page }),
    placeholderData: (previousData) => previousData,
  });
}

export function useStockOpnameDetail(id: string) {
  return useQuery({
    queryKey: [STOCK_OPNAME_DETAIL_KEY, id],
    queryFn: () => stockOpnameService.getDetail(id),
    enabled: !!id,
  });
}

export function useCreateStockOpname() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stockOpnameService.create,
    onSuccess: (data) => {
      toast.success(data.message || "Stock Opname berhasil dibuat!");
      queryClient.invalidateQueries({ queryKey: [STOCK_OPNAME_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal membuat Stock Opname");
    },
  });
}

export function useUpdateStockOpnameStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      stockOpnameService.updateStatus(id, status),
    onSuccess: (data, variables) => {
      toast.success(data.message || "Status berhasil diupdate!");
      queryClient.invalidateQueries({ queryKey: [STOCK_OPNAME_DETAIL_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [STOCK_OPNAME_QUERY_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal mengupdate status");
    },
  });
}

export function useAddStockOpnameItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      stockOpnameService.addItem(id, data),
    onSuccess: (data, variables) => {
      toast.success(data.message || "Barang berhasil ditambahkan!");
      queryClient.invalidateQueries({ queryKey: [STOCK_OPNAME_DETAIL_KEY, variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menambahkan barang");
    },
  });
}

export function useDeleteStockOpnameItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, itemId }: { id: string; itemId: string }) =>
      stockOpnameService.deleteItem(id, itemId),
    onSuccess: (data, variables) => {
      toast.success(data.message || "Barang berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: [STOCK_OPNAME_DETAIL_KEY, variables.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus barang");
    },
  });
}
