const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api"

export interface RegisterPayload {
  nama_owner: string
  username: string
  email: string
  no_telp: string
  password?: string
  password_confirmation?: string
  nama_usaha: string
  telp_usaha: string
  alamat: string
  deskripsi_usaha: string
  plan_id: string
  metode_pembayaran?: "transfer" | "qris"
}

export const authService = {
  register: async (payload: RegisterPayload) => {
    const url = `${BASE}/auth/register`
    console.log("[authService] registering:", url)
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      })
      
      const text = await res.text()
      console.log("[authService] register response:", text)
      
      let json;
      try {
        json = JSON.parse(text)
      } catch (e) {
        throw new Error(`HTTP ${res.status}: ${text}`)
      }

      if (!res.ok) {
        let errorMessage = json.message || `HTTP ${res.status}: Failed to register`;
        if (json.errors) {
          const firstErrorKey = Object.keys(json.errors)[0];
          if (firstErrorKey && json.errors[firstErrorKey].length > 0) {
            errorMessage = json.errors[firstErrorKey][0];
          }
        }
        throw new Error(errorMessage)
      }

      return json
    } catch (err) {
      console.error("[authService] register error:", err)
      throw err
    }
  },
  
  checkUsername: async (username: string) => {
    const url = `${BASE}/auth/check-username?username=${encodeURIComponent(username)}`
    try {
      const res = await fetch(url)
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.message || "Gagal mengecek username")
      }
      return json.available
    } catch (err) {
      console.error("[authService] check username error:", err)
      throw err
    }
  }
}
