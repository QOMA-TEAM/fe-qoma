import { BahanBakuContent } from "@/components/outlet/bahan-baku/bahan-baku-content";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata = {
  title: "Data Bahan Baku | Outlet - QOMA",
  description: "Kelola data bahan baku outlet",
};

export default function BahanBakuPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><span className="text-sm text-muted-foreground">KELOLA</span></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage className="text-sm">Bahan Baku</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex-1 overflow-auto">
        <BahanBakuContent />
      </main>
    </div>
  );
}
