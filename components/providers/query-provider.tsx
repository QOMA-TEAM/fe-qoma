"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Menggunakan useState memastikan instance QueryClient hanya dibuat sekali per sesi client
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // Data dianggap fresh selama 1 menit
        retry: 1, // Jika error, coba lagi 1 kali
        refetchOnWindowFocus: false, // Jangan fetch ulang otomatis ketika pindah tab browser
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
