
import { PesananDatangContent } from "@/components/outlet/sales/pesanan-datang-content";

export default function PesananDatangPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      {/* Top Header Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <h2 className="text-[#1E293B] text-[15px] font-bold">Sales</h2>
      </header>

      {/* Page Content */}
      <PesananDatangContent />
    </div>
  );
}
