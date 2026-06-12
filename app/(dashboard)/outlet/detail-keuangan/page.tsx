import { Metadata } from "next";
import { DetailKeuanganContent } from "@/components/outlet/keuangan/detail-keuangan-content";

export const metadata: Metadata = {
    title: "Detail Keuangan | QOMA Outlet",
    description: "Laporan keuangan detail outlet",
};

export default function DetailKeuanganPage() {
    return (
        <div className="flex flex-col flex-1 overflow-auto bg-gray-50/40">
            <DetailKeuanganContent />
        </div>
    );
}
