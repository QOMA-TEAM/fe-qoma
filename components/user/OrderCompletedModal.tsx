"use client";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { OrderItem } from "./CheckoutModal";

interface OrderCompletedPageProps {
  tableNumber?: string;
  orderId: string;
  customerName: string;
  phoneNumber?: string;
  paidAt: string; // misal "24 April 2026"
  orderItems: OrderItem[];
  ppn?: number;
  biayaLainnya?: number;
  onNewOrder: () => void;
}

export function OrderCompletedModal({
  tableNumber = "08",
  orderId,
  customerName,
  phoneNumber,
  paidAt,
  orderItems,
  ppn = 0,
  biayaLainnya = 0,
  onNewOrder,
}: OrderCompletedPageProps) {
  const totalFees = ppn + biayaLainnya;

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
              <p className="font-bold text-gray-900">{orderId}</p>
              <p className="text-sm text-gray-500 mt-2">Paid :</p>
              <p className="font-bold text-gray-900">{paidAt}</p>
            </div>
          </div>
        </section>

        {/* ── Ordered Menu ── */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 text-xl mb-4">Ordered Menu</h2>
          <div className="flex flex-col gap-3">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 border border-gray-100 rounded-xl p-3"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.menu.image}
                    alt={item.menu.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">
                    {item.menu.name}
                  </p>
                  <p className="text-gray-400 text-xs line-clamp-1 mt-0.5">
                    {item.menu.description}
                  </p>
                  <p className="text-gray-700 text-xs font-medium mt-1">
                    Rp. {item.totalPrice.toLocaleString("id-ID")}
                    {item.qty > 1 && (
                      <span className="text-gray-400 ml-1">(x{item.qty})</span>
                    )}
                  </p>
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
              <span>PPN 10%</span>
              <span>Rp. {ppn.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Biaya Lainnya</span>
              <span>Rp. {biayaLainnya.toLocaleString("id-ID")}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-sm font-bold text-orange-500">
              <span>Total</span>
              <span>Rp. {totalFees.toLocaleString("id-ID")}</span>
            </div>
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
