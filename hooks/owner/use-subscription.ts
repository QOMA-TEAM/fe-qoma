import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { subscriptionService } from "@/services/owner/subscription"
import type { UpgradePlanPayload } from "@/types/owner/subscription"

export const useActiveSubscription = () => {
  return useQuery({
    queryKey: ["active-subscription"],
    queryFn: subscriptionService.getActive,
  })
}

export const useAvailablePlans = () => {
  return useQuery({
    queryKey: ["available-plans"],
    queryFn: subscriptionService.getAvailablePlans,
  })
}

export const useUpgradePlan = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (payload: UpgradePlanPayload) => subscriptionService.upgradePlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["active-subscription"] })
      queryClient.invalidateQueries({ queryKey: ["available-plans"] })
    },
  })
}
