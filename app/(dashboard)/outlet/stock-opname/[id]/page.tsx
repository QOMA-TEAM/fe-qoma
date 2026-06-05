import { StockOpnameDetail } from "@/components/outlet/stock-opname/stock-opname-detail";

export const metadata = {
  title: "Detail Stock Opname | Outlet - QOMA",
  description: "Detail data stock opname outlet",
};

export default function StockOpnameDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col flex-1 overflow-auto bg-gray-50/40">
      <StockOpnameDetail id={params.id} />
    </div>
  );
}
