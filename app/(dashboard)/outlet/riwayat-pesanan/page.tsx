import { RiwayatPesananContent } from "@/components/outlet/riwayat-pesanan/riwayat-pesanan-content";

export const metadata = {
  title: "Riwayat Pesanan | Outlet - QOMA",
  description: "Lihat riwayat pesanan outlet",
};

export default function RiwayatPesananPage() {
  return (
    <div className="flex flex-col flex-1 overflow-auto bg-[#F8FAFC]">
      <RiwayatPesananContent />
    </div>
  );
}
