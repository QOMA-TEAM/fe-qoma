"use client";

import { SuperadminSidebar } from "@/components/superadmin/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
        } as React.CSSProperties
      }
    >
      <SuperadminSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
