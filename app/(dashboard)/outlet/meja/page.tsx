import { Metadata } from "next";
import { MejaContent } from "@/components/outlet/meja/meja-content";

export const metadata: Metadata = {
    title: "Kelola Meja | QOMA Outlet",
    description: "Kelola meja restoran dan QR Code",
};

export default function MejaOutletPage() {
    return (
        <div className="flex flex-col flex-1 overflow-auto bg-gray-50/40">
            <MejaContent />
        </div>
    );
}
