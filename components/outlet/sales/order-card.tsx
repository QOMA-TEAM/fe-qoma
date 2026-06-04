import { UtensilsCrossed, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pesanan } from "@/services/outlet/pesanan-service";

interface OrderCardProps {
  order: Pesanan;
  onClick?: () => void;
  className?: string;
}

export function OrderCard({ order, onClick, className }: OrderCardProps) {
  const isConfirmed = order.status === "confirmed";
  
  // Ambil 5 karakter pertama dari ID agar tidak terlalu panjang
  const shortId = order.id.split("-")[0].toUpperCase();

  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex h-[112px] rounded-[16px] overflow-hidden shadow-sm bg-[#1a5f7a] cursor-pointer hover:ring-2 ring-offset-2 ring-[#1a5f7a] transition-all",
        className
      )}
    >
      {/* Left Icon Strip */}
      <div className="w-16 flex-shrink-0 flex items-center justify-center">
        <UtensilsCrossed className="w-6 h-6 text-white" />
      </div>

      {/* Right Content */}
      <div className="flex-1 bg-white m-1 rounded-[12px] p-4 flex flex-col justify-center">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-[#1a5f7a]">
            ID : {shortId}
          </span>
          <span
            className={cn(
              "px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white",
              isConfirmed ? "bg-blue-600" : "bg-red-600"
            )}
          >
            {isConfirmed ? "CONFIRMED" : "PENDING"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[#1a5f7a] font-medium w-16">Nama</span>
              <span className="text-[#1a5f7a] font-medium truncate flex-1 pr-2">{order.nama_pelanggan}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[#1a5f7a] font-medium w-16">No. Meja</span>
              <span className="text-[#1a5f7a] font-medium">{order.nomor_meja}</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Akan diimplementasikan (misal hapus atau cancel pesanan)
            }}
            className="p-2 text-[#1a5f7a]/60 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex-shrink-0"
          >
            <Trash2 className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
