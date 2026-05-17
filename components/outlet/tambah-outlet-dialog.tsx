"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface TambahOutletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TambahOutletDialog({ open, onOpenChange }: TambahOutletDialogProps) {
  const [form, setForm] = useState({
    namaOutlet: "",
    alamatOutlet: "",
    emailOutlet: "",
    password: "",
    konfirmasiPassword: "",
  })

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Submit to API
    console.log("Submit:", form)
    onOpenChange(false)
    setForm({ namaOutlet: "", alamatOutlet: "", emailOutlet: "", password: "", konfirmasiPassword: "" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Tambah Outlet
          </DialogTitle>
        </DialogHeader>

        <div className="border-t border-gray-200 my-2" />

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="namaOutlet" className="text-sm font-semibold text-gray-700">
              Nama Outlet
            </Label>
            <Input
              id="namaOutlet"
              placeholder="Nama Outlet"
              value={form.namaOutlet}
              onChange={(e) => handleChange("namaOutlet", e.target.value)}
              className="rounded-lg border-gray-300"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alamatOutlet" className="text-sm font-semibold text-gray-700">
              Alamat Outlet
            </Label>
            <Input
              id="alamatOutlet"
              placeholder="Jl. Gajahmungkur"
              value={form.alamatOutlet}
              onChange={(e) => handleChange("alamatOutlet", e.target.value)}
              className="rounded-lg border-gray-300"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailOutlet" className="text-sm font-semibold text-gray-700">
              Email Outlet
            </Label>
            <Input
              id="emailOutlet"
              type="email"
              placeholder="Budiono@gmail.com"
              value={form.emailOutlet}
              onChange={(e) => handleChange("emailOutlet", e.target.value)}
              className="rounded-lg border-gray-300"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="rounded-lg border-gray-300"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="konfirmasiPassword" className="text-sm font-semibold text-gray-700">
                Konfirmasi Password
              </Label>
              <Input
                id="konfirmasiPassword"
                type="password"
                placeholder="••••••"
                value={form.konfirmasiPassword}
                onChange={(e) => handleChange("konfirmasiPassword", e.target.value)}
                className="rounded-lg border-gray-300"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full px-8 border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="rounded-full px-8 bg-[#1D5E84] hover:bg-[#154663] text-white"
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
