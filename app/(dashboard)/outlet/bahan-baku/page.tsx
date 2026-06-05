import { BahanBakuContent } from "@/components/outlet/bahan-baku/bahan-baku-content";

export const metadata = {
  title: "Data Bahan Baku | Outlet - QOMA",
  description: "Kelola data bahan baku outlet",
};

export default function BahanBakuPage() {
  return (
    <div className="flex flex-col flex-1 overflow-auto bg-gray-50/40">
      <BahanBakuContent />
    </div>
  );
}
