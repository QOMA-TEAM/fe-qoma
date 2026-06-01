import api from "@/lib/axios"
import type { 
  ActiveSubscriptionResponse, 
  AvailablePlansResponse, 
  UpgradePlanPayload 
} from "@/types/subscription"

export const subscriptionService = {
  getActive: async () => {
    const { data } = await api.get<ActiveSubscriptionResponse>("/owner/subscription")
    return data.data
  },
  
  getAvailablePlans: async () => {
    const { data } = await api.get<AvailablePlansResponse>("/owner/subscription/plans")
    return data.data
  },
  
  upgradePlan: async (payload: UpgradePlanPayload) => {
    const { data } = await api.post("/owner/subscription/upgrade", payload)
    return data
  }
}
