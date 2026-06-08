import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { stockOpnameService } from "@/services/outlet/stock-opname-service";
import { toast } from "sonner";

export const STOCK_OPNAME_QUERY_KEY = "stock-opname-list";
export const STOCK_OPNAME_DRAFT_KEY = "stock-opname-draft";

export function useStockOpnameList(page: number = 1, status?: string) {
  return useQuery({
    queryKey: [STOCK_OPNAME_QUERY_KEY, page, status],
    queryFn: () => stockOpnameService.getList({ page, status }),
    placeholderData: (previousData) => previousData,
  });
}

export function useStockOpnameDraftList() {
  return useQuery({
    queryKey: [STOCK_OPNAME_DRAFT_KEY],
    queryFn: () => stockOpnameService.getDraftList(),
  });
}

export function useCreateDraftOpname() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stockOpnameService.createDraft,
    onSuccess: (data) => {
      toast.success(data.message || "Draft Stock Opname berhasil dibuat!");
      queryClient.invalidateQueries({ queryKey: [STOCK_OPNAME_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [STOCK_OPNAME_DRAFT_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal membuat Draft");
    },
  });
}

export function useUpdateDraftOpname() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      stockOpnameService.updateDraft(id, data),
    onSuccess: (data) => {
      toast.success(data.message || "Draft berhasil diupdate!");
      queryClient.invalidateQueries({ queryKey: [STOCK_OPNAME_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [STOCK_OPNAME_DRAFT_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal mengupdate Draft");
    },
  });
}

export function useDeleteDraftOpname() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stockOpnameService.deleteDraft,
    onSuccess: (data) => {
      toast.success(data.message || "Draft berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: [STOCK_OPNAME_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [STOCK_OPNAME_DRAFT_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menghapus Draft");
    },
  });
}

export function useFinalizeDraftOpname() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stockOpnameService.finalizeDraft,
    onSuccess: (data) => {
      toast.success(data.message || "Stock opname berhasil difinalisasi!");
      queryClient.invalidateQueries({ queryKey: [STOCK_OPNAME_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [STOCK_OPNAME_DRAFT_KEY] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memfinalisasi Draft");
    },
  });
}
