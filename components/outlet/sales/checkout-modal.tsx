import { useState } from "react";
import Image from "next/image";
import { User, Table2, Minus, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { OrderData } from "@/components/outlet/sales/order-card";
import { cn } from "@/lib/utils";

interface CheckoutModalProps {
  order: OrderData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutModal({
  order,
  open,
  onOpenChange,
}: CheckoutModalProps) {
  // Dummy State for Cart
  const [quantities, setQuantities] = useState<number[]>([1, 1, 1, 1]);

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[1100px] w-[90vw] p-0 overflow-hidden bg-[#F6F8F9] border-none rounded-3xl h-[85vh] flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>Checkout Pesanan</DialogTitle>
        </DialogHeader>

        {/* Konten Modal Utama (2 Kolom) */}
        <div className="flex flex-1 h-full overflow-hidden">
          {/* SISI KIRI: CHECKOUT */}
          <div className="w-1/2 bg-white flex flex-col h-full rounded-l-3xl">
            <div className="p-8 pb-4">
              <h2 className="text-[22px] font-bold text-center text-[#1E293B] mb-6">
                Checkout
              </h2>

              {/* Info Pelanggan & Meja */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 bg-slate-100/80 rounded-xl p-3 flex items-center gap-3">
                  <div className="text-orange-700">
                    <User className="size-5 fill-current" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">
                      Nama :
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {order.nama}
                    </span>
                  </div>
                </div>
                <div className="flex-1 bg-slate-100/80 rounded-xl p-3 flex items-center gap-3">
                  <div className="text-orange-700">
                    <Table2 className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500 font-medium">
                      No. Meja
                    </span>
                    <span className="text-sm font-semibold text-gray-800">
                      {order.meja}
                    </span>
                  </div>
                </div>
              </div>

              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 bg-slate-100/80 px-4 py-2 rounded-lg mb-2">
                <div className="col-span-5 text-sm font-medium text-gray-400 text-center">
                  Name
                </div>
                <div className="col-span-3 text-sm font-medium text-gray-400 text-center">
                  QTY
                </div>
                <div className="col-span-4 text-sm font-medium text-gray-400 text-center">
                  Price
                </div>
              </div>
            </div>

            {/* List Order Items (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-8 space-y-1">
              {[1, 2, 3, 4].map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-50 items-center"
                >
                  <div className="col-span-5 text-sm font-bold text-gray-800">
                    Bubur Kacang Ijo
                  </div>
                  <div className="col-span-3 flex items-center justify-center gap-2">
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Minus className="size-4" />
                    </button>
                    <span className="text-sm font-semibold w-4 text-center">
                      {quantities[idx]}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Plus className="size-4" />
                    </button>
                  </div>
                  <div className="col-span-4 text-sm font-bold text-gray-800 text-center">
                    Rp. 12.000
                  </div>
                </div>
              ))}
            </div>

            {/* Summary & Bayar */}
            <div className="p-8 pt-4 space-y-3 bg-white">
              <div className="flex items-center justify-between px-6 py-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-semibold text-gray-600">
                  Sub total
                </span>
                <span className="text-sm font-bold text-gray-800">
                  Rp. 12.000
                </span>
              </div>
              <div className="flex items-center justify-between px-6 py-3 bg-slate-50 rounded-lg">
                <span className="text-sm font-semibold text-gray-600">Tax</span>
                <span className="text-sm font-bold text-gray-800">
                  Rp. 12.000
                </span>
              </div>
              <div className="flex items-center justify-between px-6 py-3 mb-6">
                <span className="text-base font-bold text-gray-800">Total</span>
                <span className="text-base font-bold text-gray-800">
                  Rp. 24.000
                </span>
              </div>

              <div className="flex justify-center">
                <Button className="w-[200px] h-11 bg-[#3874BC] hover:bg-[#2c5b96] rounded-md text-white font-medium text-base shadow-sm">
                  Bayar
                </Button>
              </div>
            </div>
          </div>

          {/* SISI KANAN: TAMBAH PESANAN */}
          <div className="w-1/2 bg-white flex flex-col h-full rounded-r-3xl">
            <div className="p-8 pb-4">
              <h2 className="text-[22px] font-bold text-center text-[#556B2F] mb-2">
                Tambah Pesanan
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-8">
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm pb-3 hover:shadow-md transition-shadow"
                  >
                    {/* Image Placeholder */}
                    <div className="w-full aspect-square bg-slate-100 relative">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs font-medium">
                        Gambar Menu
                      </div>
                      {/* Asumsikan ada gambar aslinya */}
                      {/* <Image src="..." alt="..." fill className="object-cover" /> */}
                    </div>
                    {/* Card Content */}
                    <div className="px-3 pt-3 flex flex-col items-center text-center space-y-1">
                      <h4 className="text-xs font-bold text-gray-800 line-clamp-2 leading-tight">
                        Bubur Kacang Ijo
                      </h4>
                      <p className="text-[10px] font-bold text-gray-500">
                        Rp. 12.000
                      </p>
                      <button className="mt-2 text-[10px] font-bold text-orange-500 border border-orange-500 rounded-md px-4 py-0.5 hover:bg-orange-50 transition-colors">
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
