import { Metadata } from "next";
import { MenuContent } from "@/components/outlet/menu/menu-content";

import { HeaderActions } from "@/components/dashboard/header-actions";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Kelola Menu | QOMA Outlet",
  description: "Kelola menu restoran dan harga",
};

export default function MenuOutletPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><span className="text-sm text-muted-foreground">KELOLA</span></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage className="text-sm">Menu</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderActions />
      </header>
      <main className="flex-1 overflow-auto">
        <MenuContent />
      </main>
    </div>
  );
}
