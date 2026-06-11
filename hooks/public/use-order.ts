import { useMutation } from "@tanstack/react-query"
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
