"use client";

import { useEffect } from "react";

interface OrderConfirmedModalProps {
  open: boolean;
  tableNumber?: string;
  orderId: string;
  onDone: () => void; // setelah animasi/delay, redirect ke completed page
}

export function OrderConfirmedModal({
  open,
  tableNumber = "08",
  orderId,
  onDone,
}: OrderConfirmedModalProps) {
  // Auto-redirect setelah 3 detik
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-b from-orange-500 to-orange-400 flex flex-col items-center justify-center px-6 gap-6">
      <div className="flex flex-col items-center text-center gap-2">
        <p className="text-white/90 text-lg font-medium">
          Table Number : {tableNumber}
        </p>
        <p className="text-white/90 text-lg font-medium">
          ID ORDER : {orderId}
        </p>
        <h1 className="text-white font-extrabold text-2xl md:text-3xl mt-3 uppercase tracking-wide">
          Order Confirmed
        </h1>
      </div>

      {/* ── Illustration ── */}
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
        {/* Phone */}
        <rect
          x="82"
          y="95"
          width="76"
          height="120"
          rx="10"
          ry="10"
          fill="#2D2060"
        />
        <rect
          x="87"
          y="103"
          width="66"
          height="104"
          rx="6"
          ry="6"
          fill="#3D2E8B"
        />
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
        {/* Checkmark */}
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

      <p className="text-white/70 text-sm">Redirecting…</p>
    </div>
  );
}
