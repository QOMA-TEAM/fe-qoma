import { UtensilsCrossed, Trash2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pesanan } from "@/services/outlet/pesanan-service";
import { useState, useEffect } from "react";
import { useCancelPesanan } from "@/hooks/outlet/use-pesanan";

interface OrderCardProps {
  order: Pesanan;
  onClick?: () => void;
  className?: string;
}

export function OrderCard({ order, onClick, className }: OrderCardProps) {
  const isConfirmed = order.status === "confirmed";
  const isExpired = order.status === "expired";
  const { mutate: cancelPesanan, isPending: isCanceling } = useCancelPesanan();
  
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (order.status !== "pending") {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      // 10 menit batas waktunya dari created_at
      const createdTime = new Date(order.created_at).getTime();
      const expireTime = createdTime + 10 * 60 * 1000;
      const now = new Date().getTime();
      const diff = Math.floor((expireTime - now) / 1000);
      return diff > 0 ? diff : 0;
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [order.created_at, order.status]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

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
              isConfirmed ? "bg-blue-600" : isExpired ? "bg-red-700" : "bg-orange-500"
            )}
          >
            {isConfirmed ? "CONFIRMED" : isExpired ? "EXPIRED" : "PENDING"}
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
          <div className="flex flex-col items-end justify-between gap-2">
            {order.status === "pending" && timeLeft !== null && (
              <div className={cn(
                "flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-md",
                timeLeft <= 60 ? "text-red-700 bg-red-100" : "text-orange-700 bg-orange-100"
              )}>
                {timeLeft === 0 ? <AlertCircle className="size-3.5" /> : <Clock className="size-3.5" />}
                <span>{timeLeft === 0 ? "Waktu Habis" : `Sisa Waktu: ${formatTime(timeLeft)}`}</span>
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) {
                  cancelPesanan(order.id);
                }
              }}
              disabled={isCanceling}
              className="p-2 text-[#1a5f7a]/60 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer flex-shrink-0 disabled:opacity-50"
              title="Batalkan Pesanan"
            >
              <Trash2 className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
