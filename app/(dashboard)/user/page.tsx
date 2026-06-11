// app/page.tsx  (atau pages/index.tsx)
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronRight, ShoppingCart, ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { MapPin } from "lucide-react";

import { WelcomeModal } from "@/components/user/WelcomeModal";
import { MenuDetailModal, MenuItem } from "@/components/user/MenuDetailModal";
import { OutletInfoSheet } from "@/components/user/OutletInfoSheet";
import { CategoryMenuSheet } from "@/components/user/CategoryMenuSheet";

// ── Mock Data ────────────────────────────────────────────────────────
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
  // tambahkan menu lain di sini...
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

const SECTIONS = [
  "New Menu",
  "Foods For You",
  "Drinks For You",
  "Best Of The Best",
];

// ── Menu Card Component ───────────────────────────────────────────────

function MenuCard({
  item,
  onClick,
}: {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
}) {
  return (
    <div
      className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm 
                 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
      onClick={() => onClick(item)}
    >
      {/* 
        Gambar:
        - Mobile  : aspect-square (1:1) → lebih compact
        - md+     : aspect-[4/3]        → lebih lega di desktop
      */}
      <div className="relative w-full aspect-square md:aspect-[4/3]">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>

      {/* 
        Padding:
        - Mobile  : p-2 (lebih rapat)
        - md+     : p-3
      */}
      <div className="p-2 md:p-3">
        <p className="font-semibold text-gray-800 text-xs md:text-sm truncate leading-snug">
          {item.name}
        </p>

        {/* Sembunyikan deskripsi di mobile, tampilkan di md+ */}
        <p className="hidden md:block text-gray-400 text-xs truncate mt-0.5">
          {item.description}
        </p>

        <p className="text-gray-700 text-xs md:text-sm font-medium mt-1">
          Rp. {item.price.toLocaleString("id-ID")}
        </p>

        <Button
          variant="outline"
          size="sm"
          className="mt-1.5 w-full text-xs h-7 md:h-8 border-orange-300 text-orange-500 
                     hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClick(item);
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}

// ── Category Card Component ───────────────────────────────────────────
function CategoryCard({
  name,
  onClick,
}: {
  name: string;
  onClick: (name: string) => void;
}) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer group h-36 md:h-44"
      onClick={() => onClick(name)}
    >
      <Image
        src="/images/pizza-mizna.jpg"
        alt={name}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <span className="absolute bottom-3 left-4 text-white font-bold text-sm uppercase tracking-wide">
        {name}
      </span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
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

  const handleAddOrder = (item: {
    menu: MenuItem;
    totalPrice: number;
    [key: string]: any;
  }) => {
    setCartTotal((prev) => prev + item.totalPrice);
  };

  return (
    <div className="min-h-screen bg-gray-100">
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

      {/* ── Sticky Header (Desktop) ── */}
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo + Name */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-amber-50 border">
                <Image
                  src="/images/coffee-cat-logo.png"
                  alt="logo"
                  width={36}
                  height={36}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm leading-none">
                  Pizza Mizna
                </p>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Open today, 10:00 - 22:00
                </p>
              </div>
            </div>

            {/* Table Number (hidden on xs) */}
            <div className="hidden sm:block bg-orange-100 text-orange-600 text-sm font-medium px-4 py-1.5 rounded-full">
              Table Number : 08
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-orange-500 text-xs gap-1"
                onClick={() => setShowOutletInfo(true)}
              >
                <MapPin className="w-4 h-4" />
                <span className="hidden md:inline">Outlet Info</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="relative border-orange-200 hover:bg-orange-50"
              >
                <ShoppingCart className="w-5 h-5 text-orange-500" />
                {cartTotal > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    !
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Table Number mobile */}
          <div className="sm:hidden bg-orange-100 text-orange-600 text-center text-xs font-medium py-1.5 rounded-xl mb-2">
            Table Number : 08
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96">
        <Image
          src="/images/pizza-mizna.jpg"
          alt="hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold drop-shadow-lg">
            Pizza Mizna
          </h1>
          <p className="mt-2 text-sm sm:text-base text-white/80">
            The OG Pizza of our cafe — Semarang
          </p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* ── Menu Sections ── */}
        {SECTIONS.map((section) => (
          <section key={section}>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {section}
              </h2>
              <button
                className="flex items-center gap-1 text-orange-500 text-sm font-medium hover:underline"
                onClick={() => handleOpenCategory(section)}
              >
                Lihat semua
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <MenuCard
                  key={`${section}-${idx}`}
                  item={MOCK_MENU[0]}
                  onClick={setSelectedMenu}
                />
              ))}
            </div>
          </section>
        ))}

        {/* ── Category List ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              Category List
            </h2>
          </div>

          {/* Responsive grid:
              Mobile  : 1 col
              sm      : 2 cols
              md+     : 4 cols                          */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <CategoryCard key={cat} name={cat} onClick={handleOpenCategory} />
            ))}
          </div>
        </section>
      </main>

      {/* ── Floating Cart Bar ── */}
      {cartTotal > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 bg-white border-t shadow-2xl">
          <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400">Total Order</p>
              <p className="font-bold text-gray-800">
                Rp. {cartTotal.toLocaleString("id-ID")}
              </p>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl px-8">
              Checkout — Rp {cartTotal.toLocaleString("id-ID")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
