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
          "flex min-h-[112px] rounded-2xl overflow-hidden shadow-sm transition-all border border-gray-100",
          isCancelled
            ? "bg-gray-50 cursor-default opacity-80"
            : "bg-white cursor-pointer hover:shadow-md hover:border-[#1a5f7a]/30",
          className
        )}
      >
        {/* Left Color Strip */}
        <div className={cn(
          "w-2 flex-shrink-0",
          isCancelled ? "bg-gray-300" : "bg-[#1a5f7a]" 
        )} />

        {/* Right Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-3">
          {/* Top Header: ID & Badge */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-xl flex items-center justify-center",
                isCancelled ? "bg-gray-200 text-gray-500" : "bg-[#1a5f7a]/10 text-[#1a5f7a]"
              )}>
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-medium text-gray-500 block leading-tight">ID Pesanan</span>
                <span className="text-sm font-bold text-gray-900">{shortId}</span>
              </div>
            </div>
            <span
              className={cn("px-3 py-1 text-[11px] font-bold text-white rounded-full tracking-wide shadow-sm", currentBadge.cls)}
            >
              {currentBadge.label}
            </span>
          </div>

          {/* Bottom Details & Actions */}
          <div className="flex items-end justify-between mt-1">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-500 font-medium w-14">Nama</span>
                <span className="text-gray-900 font-semibold truncate flex-1 pr-2">{order.nama_pelanggan}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-500 font-medium w-14">Meja</span>
                <span className="text-gray-900 font-semibold text-lg">{order.nomor_meja}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              {order.status === "pending" && timeLeft !== null && (
                <div className={cn(
                  "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border",
                  timeLeft <= 60 
                    ? "text-red-700 bg-red-50 border-red-200" 
                    : "text-orange-700 bg-orange-50 border-orange-200"
                )}>
                  {timeLeft === 0 ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  <span className="hidden sm:inline">{timeLeft === 0 ? "Habis" : "Sisa Waktu:"}</span>
                  <span>{timeLeft === 0 ? "" : formatTime(timeLeft)}</span>
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
                  className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer flex-shrink-0 disabled:opacity-50"
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
