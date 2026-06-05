import { StockOpnameContent } from "@/components/outlet/stock-opname/stock-opname-content";

export const metadata = {
  title: "Stock Opname | Outlet - QOMA",
  description: "Kelola data stock opname outlet",
};

export default function StockOpnamePage() {
  return (
    <div className="flex flex-col flex-1 overflow-auto bg-gray-50/40">
      <StockOpnameContent />
    </div>
  );
}
