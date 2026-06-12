import { useMutation, useQuery } from "@tanstack/react-query"
import { publicOrderService, OrderPayload } from "@/services/public/order"
import { toast } from "sonner"

export const useSubmitOrder = () => {
  return useMutation({
    mutationFn: (payload: OrderPayload) => publicOrderService.submitOrder(payload),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal membuat pesanan")
    }
  })
}

export const usePublicOrderDetail = (pesananId: string | null, outletId: string | null) => {
  return useQuery({
    queryKey: ["public-order-detail", pesananId, outletId],
    queryFn: () => publicOrderService.getPublicOrderDetail(pesananId!, outletId!),
    enabled: !!pesananId && !!outletId,
    refetchInterval: (query) => {
      // Poll every 5 seconds if order is pending or confirmed
      const status = query.state.data?.status;
      if (status === "pending" || status === "confirmed") {
        return 5000;
      }
      return false;
    },
  })
}

export const useCancelOrder = () => {
  return useMutation({
    mutationFn: ({ pesananId, outletId }: { pesananId: string; outletId: string }) => 
      publicOrderService.cancelOrder(pesananId, outletId),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Gagal membatalkan pesanan")
    }
  })
}
