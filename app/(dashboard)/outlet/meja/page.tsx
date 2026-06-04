import { Metadata } from "next";
import { MejaContent } from "@/components/outlet/meja/meja-content";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
    title: "Kelola Meja | QOMA Outlet",
    description: "Kelola meja restoran dan QR Code",
};

export default function MejaOutletPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50/40">
            <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem><span className="text-sm text-muted-foreground">KELOLA</span></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><BreadcrumbPage className="text-sm">Meja</BreadcrumbPage></BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>
            <main className="flex-1 overflow-auto">
                <MejaContent />
            </main>
        </div>
    );
}
