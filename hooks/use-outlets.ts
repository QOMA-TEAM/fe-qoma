import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { PaginatedResponse, Outlet } from "@/types/outlet"

export const useOutlets = (page: number = 1) => {
  return useQuery({
    queryKey: ["outlets", page],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Outlet>>("/owner/outlet", {
        params: {
          page,
        }
      })
      return response.data
    }
  })
}
