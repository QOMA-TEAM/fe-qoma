import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"

export interface Usaha {
  id: string
  nama: string
  // other fields omitted
}

export interface UsahaResponse {
  message: string
  data: Usaha[]
}

export const useUsaha = () => {
  return useQuery({
    queryKey: ["usaha"],
    queryFn: async () => {
      const response = await api.get<UsahaResponse>("/owner/usaha")
      return response.data
    }
  })
}
