import { UtensilsCrossed, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OrderData {
  id: string;
  nama: string;
  meja: string;
  status: "Unpaid" | "Paid" | string;
}

interface OrderCardProps {
  order: OrderData;
  onDelete?: (id: string) => void;
  onClick?: (order: OrderData) => void;
}

export function OrderCard({ order, onDelete, onClick }: OrderCardProps) {
  return (
    <div 
      onClick={() => onClick?.(order)}
      className="flex h-[112px] rounded-[16px] overflow-hidden shadow-sm bg-[#1a5f7a] cursor-pointer hover:ring-2 ring-offset-2 ring-[#1a5f7a] transition-all"
    >
      {/* Left Icon Strip */}
      <div className="w-16 flex-shrink-0 flex items-center justify-center">
        <UtensilsCrossed className="w-6 h-6 text-white" />
      </div>

      {/* Right Content */}
      <div className="flex-1 bg-white m-1 rounded-[12px] p-4 flex flex-col justify-center">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-[#1a5f7a]">
            ID : {order.id}
          </span>
          <span
            className={cn(
              "px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
              order.status === "Unpaid"
                ? "bg-red-600 text-white"
                : "bg-green-600 text-white" // Asumsi jika Paid warnanya hijau
            )}
          >
            {order.status}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-12 text-sm">
              <span className="text-[#1a5f7a] font-medium w-16">Nama</span>
              <span className="text-[#1a5f7a] font-medium">{order.nama}</span>
            </div>
            <div className="flex items-center gap-12 text-sm">
              <span className="text-[#1a5f7a] font-medium w-16">No. Meja</span>
              <span className="text-[#1a5f7a] font-medium">{order.meja}</span>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(order.id);
            }}
            className="p-2 text-[#1a5f7a]/60 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
