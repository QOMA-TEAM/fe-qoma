// app/page.tsx  (atau pages/index.tsx)
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronRight, ShoppingCart, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { WelcomeModal } from "@/components/user/WelcomeModal";
import { MenuDetailModal, MenuItem } from "@/components/user/MenuDetailModal";
import { OutletInfoSheet } from "@/components/user/OutletInfoSheet";
import { CategoryMenuSheet } from "@/components/user/CategoryMenuSheet";

// ── Mock Data ─────────────────────────────────────────
const MOCK_MENU: MenuItem[] = [
  {
    id: "pizza-mizna",
    name: "Pizza Mizna",
    price: 30000,
    description: "Pizza Mizna merupakan Pizza OG dari cafe kami",
    image: "/images/pizza-mizna.jpg",
    addOnToppings: [
      { id: "t1", name: "Extra bawang", price: 3000 },
      { id: "t2", name: "Extra keju", price: 3000 },
      { id: "t3", name: "Extra saus", price: 3000 },
      { id: "t4", name: "Extra cabai", price: 3000 },
      { id: "t5", name: "Extra tomat", price: 3000 },
    ],
    specialForYou: [
      { id: "s1", name: "Extra bawang goreng", price: 3000 },
      { id: "s2", name: "Extra mayo", price: 3000 },
    ],
  },
];

const OUTLET_INFO = {
  name: "Pizza Mizna",
  logo: "/images/coffee-cat-logo.png",
  address:
    "Jalan Senandika No.05, Siliwangi, Kec. Semarang Sel., Kota Semarang, Jawa Tengah 50241, Indonesia",
  operationalHours: [
    { day: "Monday", hours: "09:00 - 22:00" },
    { day: "Tuesday", hours: "09:00 - 22:00" },
    { day: "Wednesday", hours: "09:00 - 22:00" },
    { day: "Thursday", hours: "09:00 - 22:00" },
    { day: "Friday", hours: "09:00 - 22:00" },
    { day: "Saturday", hours: "09:00 - 22:00" },
    { day: "Sunday", hours: "09:00 - 22:00" },
  ],
};

const CATEGORIES = ["Olahan Western", "Minuman", "Dessert", "Snack"];

// ── Component ──────────────────────────────────────────
export default function MainPage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showOutletInfo, setShowOutletInfo] = useState(false);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [activeCategoryName, setActiveCategoryName] = useState("");
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [cartTotal, setCartTotal] = useState(0);

  const handleOpenCategory = (name: string) => {
    setActiveCategoryName(name);
    setShowCategorySheet(true);
  };

  const handleAddOrder = (item: any) => {
    setCartTotal((prev) => prev + item.totalPrice);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Modals ── */}
      <WelcomeModal open={showWelcome} onClose={() => setShowWelcome(false)} />

      <OutletInfoSheet
        open={showOutletInfo}
        onClose={() => setShowOutletInfo(false)}
        outlet={OUTLET_INFO}
      />

      <CategoryMenuSheet
        open={showCategorySheet}
        onClose={() => setShowCategorySheet(false)}
        categoryName={activeCategoryName}
        items={MOCK_MENU}
        totalOrderPrice={cartTotal}
        onSelectMenu={(menu) => {
          setShowCategorySheet(false);
          setSelectedMenu(menu);
        }}
        onAddOrder={() => setShowCategorySheet(false)}
      />

      <MenuDetailModal
        open={!!selectedMenu}
        onClose={() => setSelectedMenu(null)}
        menu={selectedMenu}
        onAddOrder={handleAddOrder}
      />

      {/* ── Main Layout ── */}
      <div className="max-w-2xl mx-auto bg-white min-h-screen shadow-lg">
        {/* Hero Image */}
        <div className="relative w-full h-48 md:h-64">
          <Image
            src="/images/pizza-mizna.jpg"
            alt="hero"
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <span className="font-bold text-white text-lg drop-shadow">
              Pizza Mizna
            </span>
            <button
              className="bg-white rounded-full p-2 shadow"
              onClick={() => {}} // cart
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Outlet Header Row */}
        <div className="px-4 py-3 flex items-center justify-between border-b">
          <div>
            <h1 className="font-bold text-gray-900 text-lg">Pizza Mizna</h1>
            <p className="text-gray-400 text-sm">Open today, 10:00 - 22:00</p>
          </div>
          <button
            onClick={() => setShowOutletInfo(true)}
            className="text-gray-400 hover:text-orange-500 transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Table Number Banner */}
        <div className="mx-4 my-3 bg-orange-100 text-orange-600 text-center py-2 rounded-xl text-sm font-medium">
          Table Number : 08
        </div>

        {/* ── Sections ── */}
        {[
          "New Menu",
          "Foods For You",
          "Drinks For You",
          "Best Of The Best",
        ].map((section) => (
          <section key={section} className="px-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-gray-800 text-base">{section}</h2>
              <button
                className="flex items-center gap-1 text-orange-500 text-xs font-medium hover:underline"
                onClick={() => handleOpenCategory(section)}
              >
                Lihat semua <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            {/* Horizontal scroll cards */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {MOCK_MENU.concat(MOCK_MENU).map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="flex-shrink-0 w-32 cursor-pointer"
                  onClick={() => setSelectedMenu(item)}
                >
                  <div className="relative w-32 h-24 rounded-xl overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-700 font-medium mt-1 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Rp. {item.price.toLocaleString("id-ID")}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 w-full text-xs h-7 border-orange-300 text-orange-500 hover:bg-orange-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMenu(item);
                    }}
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* ── Category List ── */}
        <section className="px-4 mb-10">
          <h2 className="font-bold text-gray-800 text-base mb-3">
            Category List
          </h2>
          <div className="flex flex-col gap-3">
            {CATEGORIES.map((cat) => (
              <div
                key={cat}
                className="relative w-full h-28 rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => handleOpenCategory(cat)}
              >
                <Image
                  src="/images/pizza-mizna.jpg"
                  alt={cat}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30" />
                <span className="absolute bottom-3 left-4 text-white font-bold text-sm uppercase tracking-wide">
                  {cat}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Floating Cart Bar */}
        {cartTotal > 0 && (
          <div className="sticky bottom-0 px-4 py-3 bg-white border-t shadow-lg">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl">
              Add Order — Rp {cartTotal.toLocaleString("id-ID")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
