"use client"

import { OwnerSidebar } from "@/components/owner-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
        } as React.CSSProperties
      }
    >
      <OwnerSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
