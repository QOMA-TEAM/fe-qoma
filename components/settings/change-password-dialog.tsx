"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import api from "@/lib/axios"

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children?: React.ReactNode
}

export function ChangePasswordDialog({ open, onOpenChange, children }: ChangePasswordDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    password_lama: "",
    password_baru: "",
    password_baru_confirmation: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (formData.password_baru !== formData.password_baru_confirmation) {
      setError("Konfirmasi password baru tidak cocok.")
      return
    }

    if (formData.password_baru.length < 6) {
      setError("Password baru minimal 6 karakter.")
      return
    }

    setIsLoading(true)
    try {
      const response = await api.post("/auth/change-password", formData)
      setSuccess(response.data.message || "Password berhasil diubah.")

      // Logout and redirect after 2 seconds
      setTimeout(() => {
        localStorage.removeItem("token")
        router.push("/login")
      }, 2000)

    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal mengubah password.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false)
      setTimeout(() => {
        setFormData({ password_lama: "", password_baru: "", password_baru_confirmation: "" })
        setError("")
        setSuccess("")
      }, 200)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Pengaturan</DialogTitle>
        </DialogHeader>

        {success ? (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="size-12 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="size-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Berhasil!</h3>
              <p className="text-sm text-gray-500">{success}</p>
            </div>
            <Loader2 className="size-5 animate-spin text-gray-400 mt-2" />
          </div>
        ) : (
          <div className="space-y-6 pt-4">
            {children}
            
            {children && <div className="border-t border-gray-200" />}

            <form onSubmit={handleSubmit} className="space-y-4">
              {children && <h3 className="font-semibold text-gray-900 text-sm">Ubah Password</h3>}
              
              {error && (
                <div className="p-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password_lama">Password Lama</Label>
                <Input
                  id="password_lama"
                  type="password"
                  value={formData.password_lama}
                  onChange={handleChange}
                  required
                  placeholder="Masukkan password lama"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_baru">Password Baru</Label>
                <Input
                  id="password_baru"
                  type="password"
                  value={formData.password_baru}
                  onChange={handleChange}
                  required
                  placeholder="Minimal 6 karakter"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_baru_confirmation">Konfirmasi Password Baru</Label>
                <Input
                  id="password_baru_confirmation"
                  type="password"
                  value={formData.password_baru_confirmation}
                  onChange={handleChange}
                  required
                  placeholder="Ketik ulang password baru"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                  Batal
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-[#1D5E84] hover:bg-[#154663] text-white">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Simpan Password
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
