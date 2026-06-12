import { Metadata } from "next";
import { MenuContent } from "@/components/outlet/menu/menu-content";

export const metadata: Metadata = {
  title: "Kelola Menu | QOMA Outlet",
  description: "Kelola menu restoran dan harga",
};

export default function MenuOutletPage() {
  return (
    <div className="flex flex-col flex-1 overflow-auto bg-gray-50/40">
      <MenuContent />
    </div>
  );
}
