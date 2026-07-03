"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { usePublicOrderDetail, useCancelOrder } from "@/hooks/public/use-order";
import { Loader2 } from "lucide-react";

interface OrderPendingPageProps {
  tableNumber?: string;
  orderId: string;
  outletId: string;
  onCancel: () => void;
  onConfirmed: () => void; // dipanggil dari luar saat backend konfirmasi
  onPaid?: () => void;
}

export function OrderPendingPage({
  tableNumber = "08",
  orderId,
  outletId,
  onCancel,
  onConfirmed,
  onPaid,
}: OrderPendingPageProps) {
  const { data: orderData } = usePublicOrderDetail(orderId, outletId);
  const cancelOrder = useCancelOrder();

  const handleCancelClick = () => {
    cancelOrder.mutate(
      { pesananId: orderId, outletId },
      {
        onSuccess: () => {
          onCancel();
        },
      }
    );
  };

  const [secondsLeft, setSecondsLeft] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`qoma_expire_${orderId}`);
      if (saved) {
        const diff = Math.floor((parseInt(saved) - Date.now()) / 1000);
        return diff > 0 ? diff : 0;
      }
    }
    return null;
  });
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!orderData?.expired_at) return;
    
    const rawDate = orderData.expired_at;
    const formattedDate = rawDate.replace(" ", "T"); 
    const expireTime = new Date(formattedDate).getTime();
    
    if (isNaN(expireTime)) return;
    
    localStorage.setItem(`qoma_expire_${orderId}`, expireTime.toString());

    const diff = Math.floor((expireTime - Date.now()) / 1000);
    setSecondsLeft(diff > 0 ? diff : 0);
  }, [orderData?.expired_at, orderId]);

  useEffect(() => {
    if (orderData?.status !== "pending") {
      if (orderData?.status === "cancelled" || orderData?.status === "expired") {
        setSecondsLeft(0);
        setExpired(true);
      }
      return;
    }

    if (secondsLeft !== null && secondsLeft <= 0) {
      setExpired(true);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s === null) return null;
        if (s <= 1) {
          clearInterval(timer);
          setExpired(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, orderData?.status]);

  // Watch status changes
  useEffect(() => {
    if (orderData?.status === "paid") {
      if (onPaid) {
        onPaid();
      } else {
        onConfirmed();
      }
    }
    // Dihapus auto-redirect onCancel agar user bisa lihat tulisan DIBATALKAN dulu
  }, [orderData?.status, onConfirmed, onPaid]);

  const minutes = secondsLeft !== null 
    ? Math.floor(secondsLeft / 60).toString().padStart(2, "0") 
    : "--";
  const seconds = secondsLeft !== null 
    ? Math.floor(secondsLeft % 60).toString().padStart(2, "0") 
    : "--";

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-500 to-orange-400 flex flex-col items-center justify-between px-6 py-16">
      {/* ── Top Info ── */}
      <div className="flex flex-col items-center text-center gap-3">
        <p className="text-white/90 text-lg font-medium">
          Table Number : {tableNumber}
        </p>
        <p className="text-white/90 text-lg font-medium">
          ID ORDER : {orderId.substring(0, 8)}
        </p>

        <h1 className="text-white font-extrabold text-2xl md:text-3xl mt-2 uppercase tracking-wide">
          {orderData?.status === "cancelled" ? "ORDER CANCELED" : (orderData?.status_label || "Show Your ID Order to Cashier")}
        </h1>

        {/* Pay Before */}
        <div className="mt-1">
          <p className="text-white font-extrabold text-xl uppercase">
            Pay Before
          </p>
          <p
            className={`font-extrabold text-5xl md:text-6xl tabular-nums mt-1 transition-colors ${
              expired ? "text-red-200" : "text-white"
            }`}
          >
            {expired ? "00:00" : `${minutes}:${seconds}`}
          </p>
          {expired && (
            <p className="text-white/80 text-sm mt-2">
              Waktu habis. Silakan buat pesanan baru.
            </p>
          )}
        </div>
      </div>

      {/* ── Illustration ── */}
      <div className="my-8">
        {/* Ilustrasi SVG hand holding phone with checkmark */}
        <svg
          viewBox="0 0 220 260"
          width="200"
          height="240"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Hand */}
          <ellipse
            cx="110"
            cy="230"
            rx="55"
            ry="22"
            fill="rgba(255,255,255,0.15)"
          />
          <path
            d="M75 170 Q68 210 80 235 Q90 255 110 258 Q130 255 140 235 Q152 210 145 170"
            fill="#FBBF8A"
          />
          {/* Fingers */}
          <path
            d="M80 175 Q72 160 76 148 Q80 138 88 142 Q92 144 91 155 L91 175Z"
            fill="#FBBF8A"
          />
          <path
            d="M93 172 Q88 154 92 142 Q96 132 104 135 Q109 137 108 150 L107 172Z"
            fill="#FBBF8A"
          />
          <path
            d="M110 172 Q107 154 110 143 Q114 133 122 136 Q127 139 125 152 L124 172Z"
            fill="#FBBF8A"
          />
          <path
            d="M125 175 Q124 158 128 148 Q132 139 140 142 Q145 146 142 158 L139 178Z"
            fill="#FBBF8A"
          />
          {/* Phone body */}
          <rect
            x="82"
            y="95"
            width="76"
            height="120"
            rx="10"
            ry="10"
            fill="#2D2060"
          />
          {/* Phone screen */}
          <rect
            x="87"
            y="103"
            width="66"
            height="104"
            rx="6"
            ry="6"
            fill="#3D2E8B"
          />
          {/* Food icon on screen */}
          <rect x="99" y="118" width="42" height="28" rx="4" fill="#FACC15" />
          <rect x="109" y="112" width="8" height="10" rx="2" fill="#FB923C" />
          <rect x="121" y="112" width="8" height="10" rx="2" fill="#FB923C" />
          <rect
            x="99"
            y="150"
            width="42"
            height="6"
            rx="3"
            fill="rgba(255,255,255,0.3)"
          />
          <rect
            x="99"
            y="160"
            width="30"
            height="6"
            rx="3"
            fill="rgba(255,255,255,0.2)"
          />
          {/* Checkmark circle */}
          <circle cx="148" cy="195" r="22" fill="white" />
          <circle cx="148" cy="195" r="18" fill="#22C55E" />
          <polyline
            points="139,195 145,202 157,187"
            fill="none"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* ── Cancel Button ── */}
      {orderData?.status === "cancelled" ? (
        <Button
          variant="outline"
          className="bg-white text-gray-700 border-none font-bold text-base rounded-2xl px-16 py-6 hover:bg-gray-50 shadow-md"
          onClick={onCancel}
        >
          BACK TO MAIN MENU
        </Button>
      ) : (
        <Button
          variant="outline"
          className="bg-white text-orange-500 border-none font-bold text-base rounded-2xl px-16 py-6 hover:bg-orange-50 shadow-md"
          onClick={handleCancelClick}
          disabled={cancelOrder.isPending || expired}
        >
          {cancelOrder.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            "CANCEL ORDER"
          )}
        </Button>
      )}
    </div>
  );
}
