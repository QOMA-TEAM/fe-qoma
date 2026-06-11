// components/modals/CategoryMenuSheet.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { MenuItem } from "./MenuDetailModal";

interface CategoryMenuSheetProps {
  open: boolean;
  onClose: () => void;
  categoryName: string;
  items: MenuItem[];
  totalOrderPrice: number;
  onSelectMenu: (menu: MenuItem) => void;
  onAddOrder: () => void;
}

export function CategoryMenuSheet({
  open,
  onClose,
  categoryName,
  items,
  totalOrderPrice,
  onSelectMenu,
  onAddOrder,
}: CategoryMenuSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="h-[90vh] rounded-t-2xl flex flex-col p-0"
      >
        {/* Table Number Banner */}
        <div className="w-full bg-orange-100 text-orange-600 text-center py-2 text-sm font-medium rounded-t-2xl">
          Table Number : 08
        </div>

        <SheetHeader className="px-5 pt-4 pb-2">
          <SheetTitle className="text-xl font-bold">Daftar Kategori</SheetTitle>
        </SheetHeader>

        {/* Category Filter Chip */}
        <div className="px-5 pb-3">
          <div className="flex items-center justify-between border border-orange-400 rounded-xl px-4 py-3">
            <span className="text-orange-500 font-semibold text-sm">
              {categoryName}
            </span>
            <span className="text-orange-400">≡</span>
          </div>
        </div>

        <Separator />

        {/* Menu List */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <h3 className="font-bold text-gray-800 text-base mb-3">
            {categoryName}
          </h3>
          <div className="flex flex-col gap-3">
            {items.map((item) => {
              const isOutOfStock = (item as any).stockStatus === "habis";
              const isLowStock = (item as any).stockStatus === "low";

              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 border rounded-xl p-3 transition ${
                    isOutOfStock
                      ? "opacity-50 bg-gray-50"
                      : "hover:shadow-sm cursor-pointer"
                  }`}
                  onClick={() => !isOutOfStock && onSelectMenu(item)}
                >
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    {isLowStock && (
                      <span className="text-xs text-orange-500 font-medium">
                        Stock Menipis &lt; 20
                      </span>
                    )}
                    {isOutOfStock && (
                      <span className="text-xs text-red-500 font-medium">
                        Stock Habis
                      </span>
                    )}
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-gray-400 text-xs line-clamp-2">
                      {item.description}
                    </p>
                    <p className="text-gray-700 text-sm font-medium mt-1">
                      Rp. {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                  {!isOutOfStock && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-gray-300 hover:border-orange-400 hover:text-orange-500 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMenu(item);
                      }}
                    >
                      Add
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        {totalOrderPrice > 0 && (
          <div className="border-t px-5 py-4 bg-white">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-gray-800">Total Order</span>
              <span className="font-bold text-gray-800">
                Rp. {totalOrderPrice.toLocaleString("id-ID")}
              </span>
            </div>
            <Button
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold"
              onClick={onAddOrder}
            >
              Add Order — Rp {totalOrderPrice.toLocaleString("id-ID")}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
