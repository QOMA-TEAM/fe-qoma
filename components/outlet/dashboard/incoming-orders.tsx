"use client";

import { useState } from "react"
import { ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { OrderCard } from "@/components/outlet/sales/order-card"
import { CheckoutModal } from "@/components/outlet/sales/checkout-modal"
import { usePesananList } from "@/hooks/outlet/use-pesanan"
import type { Pesanan } from "@/services/outlet/pesanan-service"

export function IncomingOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Pesanan | null>(null);

  // Ambil semua pesanan (kecuali expired)
  const { data: pesananResponse, isLoading, isError } = usePesananList();

  // Filter yang belum lunas (pending atau confirmed) dan ambil 3 teratas
  const activeOrders = pesananResponse?.data
    ?.filter((o) => o.status === "pending" || o.status === "confirmed")
    ?.slice(0, 3) || [];

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Pesanan Datang</h3>
          <Link
            href="/outlet/pesanan-datang"
            className="text-sm font-semibold text-gray-700 hover:text-black flex items-center gap-1 transition-colors"
          >
            Tampilkan Semua <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-[#1a5f7a]" />
          </div>
        ) : isError ? (
          <div className="text-center py-6 text-red-500 font-medium bg-red-50 rounded-xl">
            Gagal memuat pesanan
          </div>
        ) : activeOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-500 font-medium bg-white rounded-xl shadow-sm border border-gray-100">
            Belum ada pesanan masuk.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => setSelectedOrder(order)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Checkout Modal POS */}
      <CheckoutModal
        open={!!selectedOrder}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null);
        }}
        orderId={selectedOrder?.id || null}
      />
    </>
  )
}

