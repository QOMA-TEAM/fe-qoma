const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api"

export interface PlanFromBE {
  id: string
  nama_plan: string
  harga: number
  batas_outlet: number
  durasi_hari: number
  is_lifetime: boolean
  deskripsi: string | null
  status: boolean
}

export interface PlansResponse {
  message: string
  data: PlanFromBE[]
}

export const landingService = {
  getPlans: async (): Promise<PlanFromBE[]> => {
    const url = `${BASE}/public/landing/plans`
    console.log("[landingService] fetching:", url)
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      })
      console.log("[landingService] status:", res.status)
      const text = await res.text()
      console.log("[landingService] body:", text)
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`)
      const json: PlansResponse = JSON.parse(text)
      console.log("[landingService] data:", json.data)
      return json.data
    } catch (err) {
      console.error("[landingService] error:", err)
      throw err
    }
  },
}
