"use client";

import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, Image as ImageIcon } from "lucide-react";
import { useToggleOutletStatus, useUpdateOutletGambar } from "@/hooks/outlet/use-dashboard";

interface OutletSettingsContentProps {
  outlet: {
    id: number;
    nama_outlet: string;
    status_buka: boolean;
    gambar_icon?: string | null;
    gambar_header?: string | null;
  };
}

export function OutletSettingsContent({ outlet }: OutletSettingsContentProps) {
  const { mutate: toggleStatus } = useToggleOutletStatus();
  const { mutate: updateGambar, isPending } = useUpdateOutletGambar();
  
  const iconInputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);
  
  const [iconPreview, setIconPreview] = useState<string | null>(outlet.gambar_icon || null);
  const [headerPreview, setHeaderPreview] = useState<string | null>(outlet.gambar_header || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'icon' | 'header') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === 'icon') setIconPreview(e.target?.result as string);
      else setHeaderPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    const formData = new FormData();
    if (type === 'icon') formData.append('gambar_icon', file);
    else formData.append('gambar_header', file);

    updateGambar(formData);
  };

  return (
    <div className="space-y-6">
      {/* Toggle Status */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-base font-semibold">Status Outlet</Label>
          <p className="text-sm text-gray-500">
            {outlet.status_buka ? "Outlet saat ini sedang Buka" : "Outlet saat ini sedang Tutup"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Switch
            checked={outlet.status_buka}
            onCheckedChange={() => toggleStatus()}
            aria-label="Toggle outlet status"
            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
          />
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Upload Gambar */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Gambar Outlet</Label>
        
        {/* Gambar Icon */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm">Icon / Logo Outlet</Label>
            <p className="text-xs text-gray-500">Rekomendasi rasio 1:1, max 2MB</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative size-12 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
              {iconPreview ? (
                <img src={iconPreview} alt="Icon" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="size-5 text-gray-400" />
              )}
            </div>
            <input
              type="file"
              ref={iconInputRef}
              onChange={(e) => handleFileChange(e, 'icon')}
              className="hidden"
              accept="image/*"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => iconInputRef.current?.click()}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : "Upload"}
            </Button>
          </div>
        </div>

        {/* Gambar Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-sm">Gambar Header</Label>
            <p className="text-xs text-gray-500">Rekomendasi rasio 16:9, max 2MB</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="relative w-24 h-14 rounded-md overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
              {headerPreview ? (
                <img src={headerPreview} alt="Header" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="size-5 text-gray-400" />
              )}
            </div>
            <input
              type="file"
              ref={headerInputRef}
              onChange={(e) => handleFileChange(e, 'header')}
              className="hidden"
              accept="image/*"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => headerInputRef.current?.click()}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : "Upload"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
