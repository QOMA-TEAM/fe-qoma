"use client"

import { OutletSidebar } from "@/components/outlet/outlet-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function OutletLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-slate-50/50">
        <OutletSidebar />
        <SidebarInset className="flex w-full flex-col overflow-hidden">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
