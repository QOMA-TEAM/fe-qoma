import { ApprovalMenuContent } from "@/components/owner/approval-menu/approval-menu-content"
import { HeaderActions } from "@/components/dashboard/header-actions"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export const metadata = {
  title: "Approval Menu - QOMA",
  description: "Manajemen persetujuan perubahan harga menu outlet",
}

export default function ApprovalMenuPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><span className="text-sm text-muted-foreground">KELOLA</span></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage className="text-sm">Approval Menu</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <HeaderActions />
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Approval Harga Menu</h2>
          <p className="text-sm text-gray-500 mt-0.5">Persetujuan perubahan harga menu dari outlet Anda</p>
        </div>
        
        <ApprovalMenuContent />
      </main>
    </div>
  )
}
