"use client"

import * as React from "react"
import { AlertTriangle, Trash2, CheckCircle, Info } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type ConfirmVariant = "danger" | "warning" | "info" | "success"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmVariant
  onConfirm: () => void
  isLoading?: boolean
}

// QOMA orange: #ff6b00 | QOMA dark-orange: #e65a00
const variantConfig: Record<
  ConfirmVariant,
  {
    icon: React.ReactNode
    iconBg: string
    accentBar: string
    confirmClass: string
  }
> = {
  danger: {
    icon: <Trash2 className="size-6 text-[#ff6b00]" />,
    iconBg: "bg-[#fff4ec] border border-[#ffd4b0]",
    accentBar: "bg-[#ff6b00]",
    confirmClass:
      "bg-[#ff6b00] hover:bg-[#e65a00] text-white shadow-sm shadow-orange-200",
  },
  warning: {
    icon: <AlertTriangle className="size-6 text-[#ff6b00]" />,
    iconBg: "bg-[#fff4ec] border border-[#ffd4b0]",
    accentBar: "bg-[#ff6b00]",
    confirmClass:
      "bg-[#ff6b00] hover:bg-[#e65a00] text-white shadow-sm shadow-orange-200",
  },
  info: {
    icon: <Info className="size-6 text-[#ff6b00]" />,
    iconBg: "bg-[#fff4ec] border border-[#ffd4b0]",
    accentBar: "bg-[#ff6b00]",
    confirmClass:
      "bg-[#ff6b00] hover:bg-[#e65a00] text-white shadow-sm shadow-orange-200",
  },
  success: {
    icon: <CheckCircle className="size-6 text-[#ff6b00]" />,
    iconBg: "bg-[#fff4ec] border border-[#ffd4b0]",
    accentBar: "bg-[#ff6b00]",
    confirmClass:
      "bg-[#ff6b00] hover:bg-[#e65a00] text-white shadow-sm shadow-orange-200",
  },
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Ya, Lanjutkan",
  cancelLabel = "Batal",
  variant = "danger",
  onConfirm,
  isLoading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant]

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        size="sm"
        className="gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl shadow-black/10"
      >
        {/* Top accent bar */}
        <div className={`h-1 w-full ${config.accentBar}`} />

        <div className="flex flex-col gap-5 p-6">
          <AlertDialogHeader className="gap-4">
            {/* Icon */}
            <div
              className={`mx-auto flex size-14 items-center justify-center rounded-full ${config.iconBg}`}
            >
              {config.icon}
            </div>

            <div className="space-y-1.5 text-center">
              <AlertDialogTitle className="text-base font-semibold text-gray-900">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-500 leading-relaxed">
                {description}
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex-row justify-center gap-3 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="h-10 flex-1 rounded-xl border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              {cancelLabel}
            </Button>
            <Button
              onClick={() => {
                onConfirm()
                onOpenChange(false)
              }}
              disabled={isLoading}
              className={`h-10 flex-1 rounded-xl text-sm font-semibold cursor-pointer ${config.confirmClass}`}
            >
              {confirmLabel}
            </Button>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
