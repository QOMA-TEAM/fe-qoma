// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ChevronRight, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Clock, MapPin } from "lucide-react";

import { WelcomeModal } from "@/components/user/WelcomeModal";
import { MenuDetailModal, MenuItem } from "@/components/user/MenuDetailModal";
import { OutletInfoSheet } from "@/components/user/OutletInfoSheet";
import { CheckoutModal, OrderItem } from "@/components/user/CheckoutModal";
import { OrderPendingPage } from "@/components/user/OrderPendingModal";
import { OrderConfirmedModal } from "@/components/user/OrderConfirmedModal";
import { OrderCompletedModal } from "@/components/user/OrderCompletedModal";
import { useValidasiMeja, usePublicMenus } from "@/hooks/public/use-menu";
import type { PublicMenuItem, KategoriInfo } from "@/types/public/menu";

// ── Types ─────────────────────────────────────────────────────────────
type AppView =
  | "main"
  | "checkout"
  | "order-pending"
  | "order-confirmed"
  | "order-completed"
  | "category";

// ── Mock Data (Fallback) ────────────────────────────────────────────────────────
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

const PPN_RATE = 0.1; // 10%
const BIAYA_LAINNYA = 2000;
const TABLE_NUMBER = "08";

// ── Helpers ──────────────────────────────────────────────────────────
function generateOrderId(): string {
  return "ORD-" + Date.now().toString(36).toUpperCase();
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getImageUrl(path: string | null) {
  if (!path) return "/logoqoma.svg"; // Fallback to a valid public image
  if (path.startsWith("http")) return path;
  
  // Extract base storage URL from API URL automatically
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const storageBaseUrl = apiUrl.replace(/\/api\/?$/, "/storage/");
  
  return `${storageBaseUrl}${path}`;
}

function mapToMenuItem(p: PublicMenuItem): MenuItem {
  return {
    id: p.id,
    name: p.nama,
    price: p.harga,
    description: p.keterangan || "",
    image: getImageUrl(p.gambar),
    addOnToppings: [], // TODO: Phase 3
    specialForYou: [],
  };
}

// ── Menu Card Component ───────────────────────────────────────────────
function MenuCard({
  item,
  onClick,
}: {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
}) {
  const [imgSrc, setImgSrc] = useState(item.image);

  useEffect(() => {
    setImgSrc(item.image);
  }, [item.image]);

  return (
    <div
      className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm 
                 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
      onClick={() => onClick(item)}
    >
      <div className="relative w-full aspect-square md:aspect-[4/3] bg-gray-50 flex items-center justify-center">
        <Image 
          src={imgSrc} 
          alt={item.name} 
          fill 
          className={imgSrc === "/logoqoma.svg" ? "object-contain p-4 opacity-50" : "object-cover"} 
          onError={() => setImgSrc("/logoqoma.svg")}
        />
      </div>
      <div className="p-2 md:p-3">
        <p className="font-semibold text-gray-800 text-xs md:text-sm truncate leading-snug">
          {item.name}
        </p>
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
      className="relative rounded-2xl overflow-hidden cursor-pointer group h-36 md:h-44 bg-white border border-gray-100 flex items-center justify-center p-4"
      onClick={() => onClick(name)}
    >
      <Image
        src="/logoqoma.svg"
        alt={name}
        width={64}
        height={64}
        className="opacity-50 group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <span className="absolute bottom-3 left-4 text-white font-bold text-sm uppercase tracking-wide">
        {name}
      </span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────
// ── Main Page Content ─────────────────────────────────────────────────────────
function MainPageContent() {
  const searchParams = useSearchParams();
  const outletId = searchParams.get("outlet_id");
  const mejaId = searchParams.get("meja_id");

  const { data: validasiData, isLoading: isValidating, error: validasiError } = useValidasiMeja(outletId, mejaId);
  const { data: menuResponse, isLoading: isMenuLoading } = usePublicMenus(validasiData?.outlet.id || null);

  // ── View / Navigation State ──
  const [view, setView] = useState<AppView>("main");

  // ── Modal States ──
  const [showWelcome, setShowWelcome] = useState(false);
  const [showOutletInfo, setShowOutletInfo] = useState(false);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [activeCategoryName, setActiveCategoryName] = useState("");
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);

  // ── Order State ──
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);

  // ── Completed Order Info ──
  const [orderId, setOrderId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paidAt, setPaidAt] = useState("");

  // ── Derived values ──
  const subtotal = orderItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const ppn = Math.round(subtotal * PPN_RATE);
  const grandTotal = subtotal + ppn + BIAYA_LAINNYA;
  const cartItemCount = orderItems.reduce((acc, item) => acc + item.qty, 0);

  // ── Dynamic values from Validasi ──
  const outletName = validasiData?.outlet.nama_outlet || OUTLET_INFO.name;
  const tableNumber = validasiData?.meja.nomor_meja || TABLE_NUMBER;
  const dynamicOutletInfo = {
    ...OUTLET_INFO,
    name: validasiData?.outlet.nama_outlet || OUTLET_INFO.name,
    address: validasiData?.outlet.alamat || OUTLET_INFO.address,
  };

  useEffect(() => {
    // Show welcome modal once validation succeeds
    if (validasiData && !isValidating) {
      setShowWelcome(true);
    }
  }, [validasiData, isValidating]);

  // ── Handlers: Category & Menu ──
  const handleOpenCategory = (name: string) => {
    setActiveCategoryName(name);
    setView("category");
  };

  // ── Handlers: Add / Edit Order Item ──
  const handleAddOrderItem = (item: {
    menu: MenuItem;
    selectedToppings: string[];
    specialOption: string | null;
    note: string;
    qty: number;
    totalPrice: number;
  }) => {
    if (editingItem) {
      // Replace existing item
      setOrderItems((prev) =>
        prev.map((o) =>
          o.id === editingItem.id
            ? {
                ...editingItem,
                selectedToppings: item.selectedToppings,
                specialOption: item.specialOption,
                note: item.note,
                qty: item.qty,
                totalPrice: item.totalPrice,
              }
            : o,
        ),
      );
      setEditingItem(null);
    } else {
      // Add new item
      const newItem: OrderItem = {
        id: `${item.menu.id}-${Date.now()}`,
        menu: item.menu,
        selectedToppings: item.selectedToppings,
        specialOption: item.specialOption,
        note: item.note,
        qty: item.qty,
        totalPrice: item.totalPrice,
      };
      setOrderItems((prev) => [...prev, newItem]);
    }
  };

  const handleEditItem = (item: OrderItem) => {
    setEditingItem(item);
    setSelectedMenu(item.menu);
  };

  // ── Handlers: Checkout Flow ──
  const handleCheckout = () => {
    setView("checkout");
  };

  const handlePayment = (name: string, phone: string) => {
    const id = generateOrderId();
    setOrderId(id);
    setCustomerName(name);
    setPhoneNumber(phone);
    setPaidAt(formatDate(new Date()));
    setView("order-pending");
  };

  // Called when cashier confirms the order (from OrderPendingPage)
  const handleOrderConfirmed = () => {
    setView("order-confirmed");
  };

  // Called after OrderConfirmedModal auto-redirects (after ~15s)
  const handleConfirmedDone = () => {
    setView("order-completed");
  };

  // Reset everything for a new order
  const handleNewOrder = () => {
    setOrderItems([]);
    setOrderId("");
    setCustomerName("");
    setPhoneNumber("");
    setPaidAt("");
    setEditingItem(null);
    setView("main");
  };

  // ── Cancel order from pending ──
  const handleCancelOrder = () => {
    setView("checkout");
  };

  // ── Render: Non-main views (full-screen replacements) ──
  if (view === "checkout") {
    return (
      <>
        <CheckoutModal
          orderItems={orderItems}
          recommendedItems={MOCK_MENU}
          tableNumber={tableNumber}
          ppn={ppn}
          biayaLainnya={BIAYA_LAINNYA}
          onBack={() => setView("main")}
          onAddItem={() => setView("main")}
          onEditItem={handleEditItem}
          onAddRecommended={(menu) => setSelectedMenu(menu)}
          onPayment={handlePayment}
        />
        {/* MenuDetailModal for editing or adding recommended items */}
        <MenuDetailModal
          open={!!selectedMenu}
          onClose={() => {
            setSelectedMenu(null);
            setEditingItem(null);
          }}
          menu={selectedMenu}
          onAddOrder={(item) => {
            handleAddOrderItem(item);
            setSelectedMenu(null);
          }}
        />
      </>
    );
  }

  if (view === "order-pending") {
    return (
      <OrderPendingPage
        tableNumber={tableNumber}
        orderId={orderId}
        onCancel={handleCancelOrder}
        onConfirmed={handleOrderConfirmed}
      />
    );
  }

  if (view === "order-confirmed") {
    return (
      <OrderConfirmedModal
        open={true}
        tableNumber={tableNumber}
        orderId={orderId}
        onDone={handleConfirmedDone}
      />
    );
  }

  if (view === "order-completed") {
    return (
      <OrderCompletedModal
        tableNumber={tableNumber}
        orderId={orderId}
        customerName={customerName}
        phoneNumber={phoneNumber}
        paidAt={paidAt}
        orderItems={orderItems}
        ppn={ppn}
        biayaLainnya={BIAYA_LAINNYA}
        onNewOrder={handleNewOrder}
      />
    );
  }

  // ── Render: Loading or Error ──────────────────────────────────────
  if (!outletId || !mejaId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center px-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">QR Code Tidak Valid</h2>
          <p className="text-sm text-gray-500">Pastikan Anda men-scan QR code dari meja yang benar.</p>
        </div>
      </div>
    );
  }

  if (isValidating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4 gap-4">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Memvalidasi meja Anda...</p>
      </div>
    );
  }

  if (validasiError || !validasiData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center px-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Gagal Memvalidasi Meja</h2>
          <p className="text-sm text-gray-500">{(validasiError as any)?.response?.data?.message || "Terjadi kesalahan. Silakan coba scan ulang."}</p>
        </div>
      </div>
    );
  }

  // ── Render: Main View ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100">
      {/* ── Modals ── */}
      <WelcomeModal open={showWelcome} onClose={() => setShowWelcome(false)} />

      <OutletInfoSheet
        open={showOutletInfo}
        onClose={() => setShowOutletInfo(false)}
        outlet={dynamicOutletInfo}
      />

      {/* Removed CategoryMenuSheet */}

      <MenuDetailModal
        open={!!selectedMenu}
        onClose={() => {
          setSelectedMenu(null);
          setEditingItem(null);
        }}
        menu={selectedMenu}
        onAddOrder={(item) => {
          handleAddOrderItem(item);
          setSelectedMenu(null);
        }}
      />

      {/* ── Sticky Header ── */}
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
                  {outletName}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Open today, 10:00 - 22:00
                </p>
              </div>
            </div>

            {/* Table Number (hidden on xs) */}
            <div className="hidden sm:block bg-orange-100 text-orange-600 text-sm font-medium px-4 py-1.5 rounded-full">
              Table Number : {tableNumber}
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
                onClick={cartItemCount > 0 ? handleCheckout : undefined}
              >
                <ShoppingCart className="w-5 h-5 text-orange-500" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Table Number mobile */}
          <div className="sm:hidden bg-orange-100 text-orange-600 text-center text-xs font-medium py-1.5 rounded-xl mb-2">
            Table Number : {tableNumber}
          </div>
        </div>
      </header>

      {/* ── Main View Content ── */}
      {view === "main" && (
        <>
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
            {outletName}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-white/80">
            The OG Pizza of our cafe — Semarang
          </p>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-32">
        {isMenuLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* ── Menu Sections ── */}
            {menuResponse?.kategoris.map((kat: KategoriInfo) => {
              const group = menuResponse?.menu_per_kategori.find((g) => g.kategori === kat.nama);
              if (!group || group.items.length === 0) return null;

              return (
                <section key={kat.id}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                      {kat.nama}
                    </h2>
                    <button
                      className="flex items-center gap-1 text-orange-500 text-sm font-medium hover:underline"
                      onClick={() => handleOpenCategory(kat.nama)}
                    >
                      Lihat semua
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    {group.items.slice(0, 5).map((item) => (
                      <MenuCard
                        key={item.id}
                        item={mapToMenuItem(item)}
                        onClick={setSelectedMenu}
                      />
                    ))}
                  </div>
                </section>
              );
            })}

            {/* ── Category List ── */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Category List
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {menuResponse?.kategoris.map((cat: KategoriInfo) => (
                  <CategoryCard key={cat.id} name={cat.nama} onClick={handleOpenCategory} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
      </>
      )}

      {/* ── Category View Content ── */}
      {view === "category" && (
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32 min-h-screen bg-white shadow-sm mt-4 rounded-xl">
          <div className="flex items-center gap-3 mb-6 border-b pb-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-orange-500 rounded-full"
              onClick={() => setView("main")}
            >
              <ChevronRight className="w-6 h-6 rotate-180" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">{activeCategoryName}</h1>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {menuResponse?.menu_per_kategori
              .find((g) => g.kategori === activeCategoryName)
              ?.items.map((item) => (
                <MenuCard
                  key={item.id}
                  item={mapToMenuItem(item)}
                  onClick={setSelectedMenu}
                />
              ))}
          </div>
        </main>
      )}

      {/* ── Floating Cart Bar ── */}
      {orderItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 bg-white border-t shadow-2xl">
          <div className="max-w-screen-xl mx-auto flex items-center justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400">
                {cartItemCount} item{cartItemCount > 1 ? "s" : ""} · Total Order
              </p>
              <p className="font-bold text-gray-800">
                Rp. {subtotal.toLocaleString("id-ID")}
              </p>
            </div>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl px-8"
              onClick={handleCheckout}
            >
              Checkout — Rp {subtotal.toLocaleString("id-ID")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

import { Suspense } from "react";

export default function MainPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    }>
      <MainPageContent />
    </Suspense>
  );
}
