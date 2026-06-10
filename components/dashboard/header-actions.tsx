"use client"

import { Bell } from "lucide-react"

export function HeaderActions() {

  return (
    <>
      <div className="flex items-center gap-3">
        <button 
          type="button" 
          className="relative flex items-center justify-center size-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors" 
          aria-label="Notifications"
        >
          <Bell className="size-4" />
          <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-orange-500 ring-2 ring-white" />
        </button>
      </div>
    </>
  )
}
