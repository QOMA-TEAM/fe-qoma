import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface UserProfile {
  id: string
  username: string
  nama_lengkap: string
  email: string
  role: {
    name: string
  }
}

export const useProfile = () => {
  return useQuery({
    queryKey: ['auth-me'],
    queryFn: async () => {
      const response = await api.get('/auth/me')
      return response.data.data || response.data
    }
  })
}
