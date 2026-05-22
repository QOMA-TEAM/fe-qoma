import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import type { 
  DashboardResponse, 
  DashboardGraphResponse, 
  PaginatedActivityLogResponse 
} from "@/types/dashboard"

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const response = await api.get<DashboardResponse>("/owner/dashboard")
      return response.data
    }
  })
}

export const useDashboardGraph = (range: string = "7days", outletId?: string) => {
  return useQuery({
    queryKey: ["dashboard-graph", range, outletId],
    queryFn: async () => {
      const params = new URLSearchParams({ range })
      if (outletId && outletId !== "all") {
        params.append("outlet_id", outletId)
      }
      
      const response = await api.get<DashboardGraphResponse>(`/owner/dashboard/graph?${params}`)
      return response.data
    }
  })
}

export const useActivityLog = (page: number = 1, per_page: number = 10, outletId?: string) => {
  return useQuery({
    queryKey: ["activity-log", page, per_page, outletId],
    queryFn: async () => {
      const params = new URLSearchParams({ 
        page: page.toString(),
        per_page: per_page.toString()
      })
      if (outletId && outletId !== "all") {
        params.append("outlet_id", outletId)
      }

      const response = await api.get<PaginatedActivityLogResponse>(`/owner/activity-log?${params}`)
      return response.data
    }
  })
}
