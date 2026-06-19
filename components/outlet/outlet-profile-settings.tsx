"use client"

import { useState } from "react"
import { useUpdateOutletGambar, useOutletDashboard } from "@/hooks/outlet/use-dashboard"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, ImageIcon, Image as ImageIcon2 } from "lucide-react"

export function OutletProfileSettings() {
  const { data, isLoading: isDashboardLoading } = useOutletDashboard()
  const { mutate: updateGambar, isPending } = useUpdateOutletGambar()
  
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [headerFile, setHeaderFile] = useState<File | null>(null)

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIconFile(e.target.files[0])
    }
  }

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHeaderFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (!iconFile && !headerFile) return;

    const formData = new FormData()
    if (iconFile) formData.append("gambar_icon", iconFile)
    if (headerFile) formData.append("gambar_header", headerFile)

    updateGambar(formData, {
      onSuccess: () => {
        setIconFile(null)
        setHeaderFile(null)
      }
    })
  }

  const outlet = data?.data?.outlet

  if (isDashboardLoading) {
    return <div className="flex justify-center py-4"><Loader2 className="animate-spin text-gray-400" /></div>
  }

  return (
    <div className="space-y-4 mb-6">
      <h3 className="font-semibold text-gray-900 text-sm">Profil Outlet</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Icon Outlet</Label>
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border shrink-0">
              {iconFile ? (
                <img src={URL.createObjectURL(iconFile)} alt="Icon preview" className="w-full h-full object-cover" />
              ) : outlet?.gambar_icon ? (
                <img src={outlet.gambar_icon} alt="Icon outlet" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="size-6 text-gray-400" />
              )}
            </div>
            <Input type="file" accept="image/*" onChange={handleIconChange} className="flex-1 cursor-pointer" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Header Outlet</Label>
          <div className="flex flex-col gap-2">
            <div className="w-full h-24 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border">
              {headerFile ? (
                <img src={URL.createObjectURL(headerFile)} alt="Header preview" className="w-full h-full object-cover" />
              ) : outlet?.gambar_header ? (
                <img src={outlet.gambar_header} alt="Header outlet" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon2 className="size-8 text-gray-400" />
              )}
            </div>
            <Input type="file" accept="image/*" onChange={handleHeaderChange} className="cursor-pointer" />
          </div>
        </div>

        {(iconFile || headerFile) && (
          <Button 
            type="button" 
            onClick={handleUpload} 
            disabled={isPending}
            className="w-full bg-[#1D5E84] hover:bg-[#154663] text-white"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
            Upload Gambar
          </Button>
        )}
      </div>
    </div>
  )
}
