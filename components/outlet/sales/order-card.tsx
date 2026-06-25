import { UtensilsCrossed, Trash2, Clock, AlertCircle, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pesanan } from "@/services/outlet/pesanan-service";
import { useState, useEffect } from "react";
import { useCancelPesanan } from "@/hooks/outlet/use-pesanan";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import Link from "next/link";

interface OrderCardProps {
  order: Pesanan;
  onClick?: () => void;
  className?: string;
}

export function OrderCard({ order, onClick, className }: OrderCardProps) {
  const isConfirmed = order.status === "confirmed";
  const isExpired = order.status === "expired";
  const isCancelled = order.status === "cancelled";
  const { mutate: cancelPesanan, isPending: isCanceling } = useCancelPesanan();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (order.status !== "pending") {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      // Backend mengembalikan "Y-m-d H:i", misal: "2024-06-18 15:30"
      // Kita ubah spasi jadi "T" agar valid di semua browser, dan parser akan menganggapnya local time
      const rawDate = order.created_at;
      const formattedDate = rawDate.replace(" ", "T"); 
      const createdTime = new Date(formattedDate).getTime();
      const expireTime = createdTime + 10 * 60 * 1000;
      const now = Date.now();
      
      if (isNaN(createdTime)) return 0; // fallback jika parsing gagal
      
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

  // Badge label & colour per status
  const statusBadge: Record<string, { label: string; cls: string }> = {
    confirmed: { label: "CONFIRMED", cls: "bg-blue-600" },
    expired: { label: "EXPIRED", cls: "bg-red-700" },
    cancelled: { label: "DIBATALKAN", cls: "bg-gray-500" },
    pending: { label: "PENDING", cls: "bg-orange-500" },
    paid: { label: "PAID", cls: "bg-green-600" },
  };
  
  const currentBadge = statusBadge[order.status] || { label: order.status.toUpperCase(), cls: "bg-gray-500" };

  // Ambil 5 karakter pertama dari ID agar tidak terlalu panjang
  const shortId = order.id.split("-")[0].toUpperCase();

  return (
    <>
      <div 
        onClick={isCancelled ? undefined : onClick}
        className={cn(
          "flex h-[112px] rounded-[16px] overflow-hidden shadow-sm transition-all",
          isCancelled
            ? "bg-gray-400 cursor-default opacity-70"
            : "bg-[#1a5f7a] cursor-pointer hover:ring-2 ring-offset-2 ring-[#1a5f7a]",
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
              className={cn("px-2.5 py-1 text-[10px] font-bold text-white rounded-md tracking-wider shadow-sm", currentBadge.cls)}
            >
              {currentBadge.label}
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

              {/* Tombol: cancel jika pending/confirmed */}
              {!isCancelled && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCancelConfirm(true);
                  }}
                  disabled={isCanceling}
                  className="p-2 text-[#1a5f7a]/60 hover:text-[#ff6b00] hover:bg-orange-50 rounded-lg transition-colors cursor-pointer flex-shrink-0 disabled:opacity-50"
                  title="Batalkan Pesanan"
                >
                  <Trash2 className="w-[18px] h-[18px]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showCancelConfirm}
        onOpenChange={setShowCancelConfirm}
        title="Batalkan Pesanan"
        description="Apakah Anda yakin ingin membatalkan pesanan ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, Batalkan"
        cancelLabel="Kembali"
        variant="danger"
        onConfirm={() => cancelPesanan(order.id)}
      />
    </>
  );
}
