"use client"

import { useState } from "react"
import { Settings, Bell } from "lucide-react"
import { ChangePasswordDialog } from "@/components/settings/change-password-dialog"

export function HeaderActions() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-3">
        <button 
          type="button" 
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center justify-center size-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer" 
          aria-label="Settings"
        >
          <Settings className="size-4" />
        </button>
        <button 
          type="button" 
          className="relative flex items-center justify-center size-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors" 
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-orange-500 ring-2 ring-white" />
        </button>
      </div>

      <ChangePasswordDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </>
  )
}
