"use client";

import { useState } from "react";
import { OrderCard } from "@/components/outlet/sales/order-card";
import { CheckoutModal } from "@/components/outlet/sales/checkout-modal";
import { usePesananList } from "@/hooks/outlet/use-pesanan";
import { Loader2, Receipt } from "lucide-react";
import type { Pesanan } from "@/services/outlet/pesanan-service";

export function PesananDatangContent() {
  const [selectedOrder, setSelectedOrder] = useState<Pesanan | null>(null);
  
  // Ambil semua pesanan (kecuali expired)
  const { data: pesananResponse, isLoading, isError } = usePesananList();

  // Filter yang belum lunas (pending atau confirmed)
  const activeOrders = pesananResponse?.data
    ?.filter((o) => o.status === "pending" || o.status === "confirmed") || [];

  return (
    <>
      <main className="flex-1 overflow-auto p-8 bg-[#F8FAFC]">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Section Title */}
          <div>
            <h2 className="text-[24px] font-bold text-[#1E293B]">Pesanan Datang</h2>
          </div>

          {/* List Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-[#1E293B] mb-4" />
              <p className="text-gray-500 font-medium">Memuat data pesanan...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-20 text-red-500 font-medium bg-red-50 rounded-2xl">
              Gagal memuat pesanan
            </div>
          ) : activeOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Receipt className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Pesanan</h3>
              <p className="text-gray-500 max-w-sm text-center">
                Saat ini belum ada pesanan baru yang masuk ke kasir.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
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
      </main>

      {/* Checkout Modal POS */}
      <CheckoutModal
        open={!!selectedOrder}
        onOpenChange={(open) => {
          if (!open) setSelectedOrder(null);
        }}
        orderId={selectedOrder?.id || null}
      />
    </>
  );
}
