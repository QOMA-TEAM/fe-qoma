"use client"

import { OutletSidebar } from "@/components/outlet/outlet-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { OutletHeader } from "@/components/outlet/outlet-header"

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
          <OutletHeader />
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
