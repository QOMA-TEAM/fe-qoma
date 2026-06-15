"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Plus, Edit2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MenuItem } from "@/components/user/MenuDetailModal";

export interface OrderItem {
  id: string; // unique per order line
  menu: MenuItem;
  selectedToppings: string[];
  selectedToppingsData?: { id: string; name: string; price: number }[];
  specialOption: string | null;
  note: string;
  qty: number;
  totalPrice: number;
}

interface CheckoutModalProps {
  orderItems: OrderItem[];
  recommendedItems: MenuItem[];
  tableNumber?: string;
  onBack: () => void;
  onAddItem: () => void; // kembali ke main untuk tambah item
  onEditItem: (item: OrderItem) => void;
  onAddRecommended: (menu: MenuItem) => void;
  onPayment: (customerName: string, phoneNumber: string) => void;
  isLoading?: boolean;
}

export function CheckoutModal({
  orderItems,
  recommendedItems,
  tableNumber = "08",
  onBack,
  onAddItem,
  onEditItem,
  onAddRecommended,
  onPayment,
  isLoading = false,
}: CheckoutModalProps) {
  const [step, setStep] = useState<"cart" | "form">("cart");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nameError, setNameError] = useState(false);

  const subtotal = orderItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const grandTotal = subtotal;

  const handlePayment = () => {
    if (!customerName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);
    onPayment(customerName.trim(), phoneNumber.trim());
  };

  const handleBack = () => {
    if (step === "form") {
      setStep("cart");
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-screen-md mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="font-bold text-gray-900 text-lg flex-1 text-center pr-9">
            {step === "cart" ? "Cart" : "Check Out"}
          </h1>
        </div>
      </header>

      <div className="max-w-screen-md mx-auto px-4 py-5 space-y-5">
        {/* ── Table Number Banner ── */}
        <div className="w-full bg-orange-100 text-orange-600 text-center py-3 rounded-xl font-semibold">
          Table Number : {tableNumber}
        </div>

        {step === "cart" ? (
          <>
            {/* ── Recommended Menu ── */}
            {recommendedItems.length > 0 && (
              <section className="bg-white rounded-2xl p-5 shadow-sm">
                <h2 className="font-bold text-gray-900 text-lg mb-4">
                  Foods For You
                </h2>
                <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1">
                  {recommendedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex-shrink-0 w-32 border border-gray-100 rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition"
                      onClick={() => onAddRecommended(item)}
                    >
                      <div className="relative w-full aspect-square">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <p className="font-semibold text-gray-800 text-xs truncate">
                          {item.name}
                        </p>
                        <p className="text-gray-600 text-xs mt-0.5">
                          Rp. {item.price.toLocaleString("id-ID")}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-1.5 w-full text-xs h-7 border-orange-300 text-orange-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddRecommended(item);
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Ordered Menu ── */}
            <section className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 text-lg">Ordered Menu</h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-orange-500 border-orange-400 hover:bg-orange-50 text-xs gap-1 rounded-xl"
                  onClick={onAddItem}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Item
                </Button>
              </div>

              {orderItems.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Belum ada pesanan. Tambah item terlebih dahulu.
                </div>
              ) : (
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
                          {item.qty > 1 && (
                            <span className="text-gray-500 mr-1">
                              {item.qty}x
                            </span>
                          )}
                          Rp. {(item.totalPrice / item.qty).toLocaleString("id-ID")}
                          {item.qty > 1 && (
                            <span className="font-bold ml-2">
                              = Rp. {item.totalPrice.toLocaleString("id-ID")}
                            </span>
                          )}
                        </p>
                        {item.selectedToppingsData && item.selectedToppingsData.length > 0 && (
                          <p className="text-gray-400 text-xs mt-0.5">
                            +{" "}
                            {item.selectedToppingsData
                              .map((t) => t.name)
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs border-gray-300 hover:border-orange-400 hover:text-orange-500 flex-shrink-0 gap-1 rounded-xl"
                        onClick={() => onEditItem(item)}
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* ── Total Order ── */}
            <div className="flex items-center justify-between px-1 mt-4">
              <span className="font-bold text-gray-900 text-lg">Total Order</span>
              <span className="font-bold text-gray-900 text-2xl">
                Rp. {grandTotal.toLocaleString("id-ID")}
              </span>
            </div>

            {/* ── Checkout Button ── */}
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl h-14 text-base mt-4"
              onClick={() => setStep("form")}
              disabled={orderItems.length === 0}
            >
              Checkout
            </Button>
          </>
        ) : (
          <>
            {/* ── Customer Information ── */}
            <section className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <h2 className="font-bold text-gray-900 text-lg">
                Customer Information
              </h2>
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-700">Name :</Label>
                <Input
                  placeholder="Insert Name (must field)"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (e.target.value.trim()) setNameError(false);
                  }}
                  className={`rounded-xl ${nameError ? "border-red-400 focus-visible:ring-red-300" : ""}`}
                />
                {nameError && (
                  <p className="text-xs text-red-500">Name is required.</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-700">Phone Number (Optional) :</Label>
                <Input
                  placeholder="Insert Number Phone (for promo notification)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  type="tel"
                  className="rounded-xl"
                />
              </div>
            </section>

            {/* ── Dine In Banner ── */}
            <div className="w-full bg-orange-100 text-orange-500 text-center py-3.5 rounded-xl font-semibold mt-4">
              Makan di tempat
            </div>

            {/* ── Payment Detail ── */}
            <section className="bg-white rounded-2xl p-5 shadow-sm mt-4">
              <h2 className="font-bold text-gray-900 text-lg text-center mb-4">
                Payment Detail
              </h2>
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>Rp. {subtotal.toLocaleString("id-ID")}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm font-bold text-orange-500">
                  <span>Total Pembayaran</span>
                  <span>Rp. {grandTotal.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </section>

            {/* ── Payment Button ── */}
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl h-14 text-base mt-4"
              onClick={handlePayment}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                "Payment"
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
