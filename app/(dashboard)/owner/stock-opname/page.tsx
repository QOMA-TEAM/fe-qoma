import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { StockOpnameContent } from "@/components/owner/stock-opname/stock-opname-content";
import { HeaderActions } from "@/components/dashboard/header-actions";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-2 md:hidden" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <span className="text-sm text-muted-foreground uppercase">LAPORAN</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm">Stock Opname</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <HeaderActions />
      </header>
      
      <main className="flex-1 p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Histori Stock Opname
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Pantau riwayat pencatatan stock opname di seluruh outlet Anda
          </p>
        </div>

        <StockOpnameContent />
      </main>
    </div>
  );
}
