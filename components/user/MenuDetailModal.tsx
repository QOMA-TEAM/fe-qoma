// components/modals/MenuDetailModal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { usePublicMenuDetail } from "@/hooks/public/use-menu";

export interface ToppingOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  addOnToppings?: ToppingOption[]; // checkbox, max 3
  specialForYou?: ToppingOption[]; // radio, max 1
}

interface MenuDetailModalProps {
  open: boolean;
  onClose: () => void;
  menu: MenuItem | null;
  onAddOrder: (item: {
    menu: MenuItem;
    selectedToppings: string[];
    selectedToppingsData?: ToppingOption[];
    specialOption: string | null;
    note: string;
    qty: number;
    totalPrice: number;
  }) => void;
}

export function MenuDetailModal({
  open,
  onClose,
  menu,
  onAddOrder,
}: MenuDetailModalProps) {
  const [qty, setQty] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [specialOption, setSpecialOption] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [imgSrc, setImgSrc] = useState(menu?.image || "/logoqoma.svg");

  useEffect(() => {
    if (menu) {
      setImgSrc(menu.image || "/logoqoma.svg");
    }
  }, [menu]);

  const searchParams = useSearchParams();
  const outletId = searchParams?.get("outlet_id");
  const { data: menuDetail, isLoading } = usePublicMenuDetail(menu?.id || null, outletId);

  if (!menu) return null;

  const dynamicAddons: ToppingOption[] = menuDetail?.addons_tersedia
    ? menuDetail.addons_tersedia.map((a) => ({
        id: a.id,
        name: a.nama,
        price: Number(a.harga),
      }))
    : menu.addOnToppings || [];

  const toppingPrice = selectedToppings.reduce((acc, id) => {
    const t = dynamicAddons.find((x) => x.id === id);
    return acc + (t ? t.price : 0);
  }, 0);

  const specialPrice =
    menu.specialForYou?.find((s) => s.id === specialOption)?.price ?? 0;
  const totalPrice = (menu.price + toppingPrice + specialPrice) * qty;

  const handleToggleTopping = (id: string) => {
    setSelectedToppings((prev) => {
      if (prev.includes(id)) return prev.filter((t) => t !== id);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, id];
    });
  };

  const handleAdd = () => {
    onAddOrder({
      menu,
      selectedToppings,
      selectedToppingsData: selectedToppings
        .map((tid) => dynamicAddons.find((t) => t.id === tid))
        .filter(Boolean) as ToppingOption[],
      specialOption,
      note,
      qty,
      totalPrice,
    });
    onClose();
    // reset
    setQty(1);
    setSelectedToppings([]);
    setSpecialOption(null);
    setNote("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full p-0 overflow-hidden rounded-2xl" showCloseButton={false}>
        <VisuallyHidden>
          <DialogTitle>{menu.name}</DialogTitle>
        </VisuallyHidden>
        {/* Hero Image */}
        <div className="relative w-full h-56 bg-gray-50 flex items-center justify-center">
          <Image
            src={imgSrc}
            alt={menu.name}
            fill
            className={imgSrc === "/logoqoma.svg" ? "object-contain p-8 opacity-50" : "object-cover"}
            onError={() => setImgSrc("/logoqoma.svg")}
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[60vh] px-5 py-4 flex flex-col gap-4">
          {/* Title */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">{menu.name}</h2>
            <p className="text-orange-500 font-semibold text-base">
              Rp. {menu.price.toLocaleString("id-ID")}
            </p>
            <p className="text-gray-500 text-sm mt-1">{menu.description}</p>
          </div>

          <Separator />

          {/* Add on Topping (Checkbox, max 3) */}
          {isLoading ? (
            <div className="flex justify-center items-center p-6">
              <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
            </div>
          ) : dynamicAddons.length > 0 && (
            <div className="border rounded-xl p-4 flex flex-col gap-3">
              <div>
                <h3 className="font-semibold text-gray-800">Add on Topping</h3>
                <p className="text-xs text-gray-400">Optional Max 3.</p>
              </div>
              {dynamicAddons.map((topping) => (
                <div
                  key={topping.id}
                  className="flex items-center justify-between"
                >
                  <Label
                    htmlFor={`topping-${topping.id}`}
                    className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
                  >
                    <Checkbox
                      id={`topping-${topping.id}`}
                      checked={selectedToppings.includes(topping.id)}
                      onCheckedChange={() => handleToggleTopping(topping.id)}
                      className="border-orange-400 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                    />
                    {topping.name}
                  </Label>
                  <span className="text-sm text-gray-500">
                    (Rp {topping.price.toLocaleString("id-ID")})
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Special For You (Radio, max 1) */}
          {menu.specialForYou && menu.specialForYou.length > 0 && (
            <div className="border rounded-xl p-4 flex flex-col gap-3">
              <div>
                <h3 className="font-semibold text-gray-800">Special For You</h3>
                <p className="text-xs text-gray-400">Optional Max 1.</p>
              </div>
              <RadioGroup
                value={specialOption ?? ""}
                onValueChange={(val) => setSpecialOption(val || null)}
              >
                {menu.specialForYou.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center justify-between"
                  >
                    <Label
                      htmlFor={`special-${option.id}`}
                      className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
                    >
                      <RadioGroupItem
                        id={`special-${option.id}`}
                        value={option.id}
                        className="border-orange-400 text-orange-500"
                      />
                      {option.name}
                    </Label>
                    <span className="text-sm text-gray-500">
                      (Rp {option.price.toLocaleString("id-ID")})
                    </span>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Catatan */}
          <div className="flex flex-col gap-2">
            <Label className="font-semibold text-gray-800 text-sm">
              Catatan{" "}
              <span className="text-gray-400 font-normal">(Opsional)</span>
            </Label>
            <Textarea
              placeholder="Contoh: lebih pedas, tanpa bawang, dll."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="resize-none text-sm"
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t bg-white flex items-center justify-between gap-4">
          {/* Qty */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-semibold text-gray-800 w-4 text-center">
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="w-8 h-8 rounded-full border border-orange-400 text-orange-500 flex items-center justify-center hover:bg-orange-50 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add Order Button */}
          <Button
            onClick={handleAdd}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold"
          >
            Add Order — Rp {totalPrice.toLocaleString("id-ID")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
