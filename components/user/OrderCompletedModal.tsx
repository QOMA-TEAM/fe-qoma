"use client";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { usePublicOrderDetail } from "@/hooks/public/use-order";
import { Loader2 } from "lucide-react";

interface OrderCompletedPageProps {
  tableNumber?: string;
  orderId: string;
  outletId: string;
  onNewOrder: () => void;
}

export function OrderCompletedModal({
  tableNumber = "08",
  orderId,
  outletId,
  onNewOrder,
}: OrderCompletedPageProps) {
  const { data: orderData, isLoading } = usePublicOrderDetail(orderId, outletId);

  if (isLoading || !orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const subtotal = orderData.total_harga;
  const grandTotal = subtotal;

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr || dateStr === "-") return "-";
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const paidAt = formatDateTime(orderData.pembayaran?.paid_at);
  const customerName = orderData.nama_pelanggan;
  const phoneNumber = orderData.no_telp;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-screen-md mx-auto px-4 h-14 flex items-center justify-center">
          <h1 className="font-bold text-gray-900 text-lg">Check Out</h1>
        </div>
      </header>

      <div className="max-w-screen-md mx-auto px-4 py-5 space-y-5">
        {/* ── Table Number Banner ── */}
        <div className="w-full bg-orange-100 text-orange-600 text-center py-3 rounded-xl font-semibold">
          Table Number : {tableNumber}
        </div>

        {/* ── Customer Info ── */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold text-gray-900 text-lg mb-3">
                Customer Information
              </h2>
              <p className="text-sm text-gray-600">
                Name :{" "}
                <span className="font-bold text-gray-900">{customerName}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Phone Number :{" "}
                <span className="text-gray-700">{phoneNumber || "–"}</span>
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm text-gray-500">ID ORDER :</p>
              <p className="font-bold text-gray-900 break-all w-48 ml-auto text-xs">{orderId.substring(0, 4)}</p>
              <p className="text-sm text-gray-500 mt-2">Paid :</p>
              <p className="font-bold text-gray-900">{paidAt}</p>
            </div>
          </div>
        </section>

        {/* ── Ordered Menu ── */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 text-xl mb-4">Ordered Menu</h2>
          <div className="flex flex-col gap-3">
            {orderData.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 border border-gray-100 rounded-xl p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">
                    {item.nama}
                  </p>
                  <p className="text-gray-700 text-xs font-medium mt-1">
                    {item.qty > 1 && (
                      <span className="text-gray-500 mr-1">{item.qty}x</span>
                    )}
                    Rp. {item.harga.toLocaleString("id-ID")}
                    {item.qty > 1 && (
                      <span className="font-bold ml-2">
                        = Rp. {item.subtotal.toLocaleString("id-ID")}
                      </span>
                    )}
                  </p>
                  {item.addons && item.addons.length > 0 && (
                    <div className="mt-2 space-y-1 pl-2 border-l-2 border-orange-200">
                      {item.addons.map((a, i) => (
                        <p key={i} className="text-gray-500 text-xs font-medium">
                          + {a.nama} {a.qty > 1 ? `(${a.qty}x)` : ""} - Rp. {(a.harga * a.qty).toLocaleString("id-ID")}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Payment Detail ── */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 text-xl text-center mb-4">
            Payment Detail
          </h2>
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>Rp. {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm font-bold text-orange-500">
              <span>Total Tagihan</span>
              <span>Rp. {grandTotal.toLocaleString("id-ID")}</span>
            </div>

            {orderData.pembayaran && (
              <>
                <div className="flex justify-between text-sm text-gray-500 pt-1">
                  <span className="capitalize">Pembayaran ({orderData.pembayaran.metode})</span>
                  <span>Rp. {orderData.pembayaran.jumlah_bayar.toLocaleString("id-ID")}</span>
                </div>
                {orderData.pembayaran.jumlah_bayar > grandTotal && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Kembalian</span>
                    <span>Rp. {(orderData.pembayaran.jumlah_bayar - grandTotal).toLocaleString("id-ID")}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ── Make New Order ── */}
        <div className="flex justify-center pb-6">
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl px-16 py-6 text-base"
            onClick={onNewOrder}
          >
            Make New Order
          </Button>
        </div>
      </div>
    </div>
  );
}
