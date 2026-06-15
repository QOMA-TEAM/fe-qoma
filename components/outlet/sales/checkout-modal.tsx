import { useState, useEffect } from "react";
import Image from "next/image";
import { User, Table2, Minus, Plus, Delete, Loader2, CheckCircle2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePesananDetail, useKonfirmasiPesanan, useBayarPesanan, useTambahItem, useUpdateQtyItem, useHapusItem, useUpdateTipePesanan } from "@/hooks/outlet/use-pesanan";
import { useOutletMenuList } from "@/hooks/outlet/use-menu-outlet";
import type { PesananDetail } from "@/services/outlet/pesanan-service";
import type { OutletMenu } from "@/services/outlet/menu-outlet-service";

function QtyInput({ 
  item, 
  orderId, 
  updateQty, 
  isUpdating 
}: { 
  item: PesananDetail; 
  orderId: string; 
  updateQty: any; 
  isUpdating: boolean 
}) {
  const [val, setVal] = useState(item.qty.toString());

  useEffect(() => {
    setVal(item.qty.toString());
  }, [item.qty]);

  const handleBlur = () => {
    const newQty = parseInt(val, 10);
    if (!isNaN(newQty) && newQty >= 1 && newQty !== item.qty) {
      updateQty({ 
        id: orderId, 
        detailId: item.id, 
        qty: newQty,
        currentQty: item.qty,
        harga: item.harga 
      });
    } else {
      setVal(item.qty.toString()); // revert jika tidak valid (termasuk jika 0)
    }
  };

  return (
    <input
      type="number"
      min="1"
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={handleBlur}
      disabled={isUpdating}
      className="w-12 text-center text-sm font-semibold border border-gray-200 rounded-md py-1 outline-none focus:border-[#3874BC] focus:ring-1 focus:ring-[#3874BC] disabled:opacity-50 transition-colors"
    />
  );
}

interface CheckoutModalProps {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutModal({
  orderId,
  open,
  onOpenChange,
}: CheckoutModalProps) {
  // State for Payment Screen
  const [isPaying, setIsPaying] = useState(false);
  const [nominal, setNominal] = useState("0");

  // State for Addon Selection
  const [selectedMenuForAddon, setSelectedMenuForAddon] = useState<OutletMenu | null>(null);
  const [addonSelections, setAddonSelections] = useState<{ addon_id: string; qty: number; nama: string; harga: number }[]>([]);

  const { data: detailResponse, isLoading } = usePesananDetail(orderId || "");
  const order = detailResponse?.data;

  const { data: menusResponse, isLoading: isLoadingMenus, isError: menusError } = useOutletMenuList();
  const menus = menusResponse?.data;

  const { mutate: confirmOrder, isPending: isConfirming } = useKonfirmasiPesanan();
  const { mutate: payOrder, isPending: isPayingOrder } = useBayarPesanan();
  const { mutate: tambahItem, isPending: isAddingItem } = useTambahItem();
  const { mutate: updateQty, isPending: isUpdatingQty } = useUpdateQtyItem();
  const { mutate: hapusItem, isPending: isDeletingItem } = useHapusItem();
  const { mutate: updateTipe, isPending: isUpdatingTipe } = useUpdateTipePesanan();

  // Reset state when opened/closed
  useEffect(() => {
    if (!open) {
      setIsPaying(false);
      setNominal("0");
      setSelectedMenuForAddon(null);
      setAddonSelections([]);
    }
  }, [open]);

  if (!open) return null;

  const formatRp = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleNumpad = (val: string) => {
    if (val === ".") {
      if (!nominal.includes(".")) setNominal((prev) => prev + ".");
    } else {
      setNominal((prev) => (prev === "0" ? val : prev + val));
    }
  };

  const handleBackspace = () => {
    setNominal((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  };

  const handleConfirm = () => {
    if (!orderId) return;
    confirmOrder(orderId);
  };

  const handlePay = () => {
    if (!orderId) return;
    payOrder(
      { id: orderId, metode: "tunai" },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  const handleKlikAddMenu = (menu: OutletMenu) => {
    if (menu.addons && menu.addons.length > 0) {
      setSelectedMenuForAddon(menu);
      setAddonSelections([]);
    } else {
      handleTambahItem(menu.id, menu.nama, menu.harga, []);
    }
  };

  const handleTambahItem = (menuId: string, menuNama: string, menuHarga: number, addons: any[] = []) => {
    if (!orderId || !order) return;
    
    // Cek apakah menu sudah ada di keranjang (hanya merge jika tidak pakai addon)
    const existingItem = addons.length === 0 
      ? order.items?.find((item) => item.menu_id === menuId && (!item.addons || item.addons.length === 0))
      : null;
    
    if (existingItem) {
      // Jika sudah ada dan tanpa addon, tambah qty saja
      updateQty({ 
        id: orderId, 
        detailId: existingItem.id, 
        qty: existingItem.qty + 1,
        currentQty: existingItem.qty,
        harga: menuHarga 
      });
    } else {
      // Jika belum ada atau pakai addon, tambah item baru
      tambahItem({ 
        id: orderId, 
        items: [{ menu_id: menuId, qty: 1, addons: addons }],
        menuNama,
        menuHarga 
      }, {
        onSuccess: () => {
          setSelectedMenuForAddon(null);
          setAddonSelections([]);
        }
      });
    }
  };

  const handleAddonQty = (addon: { id: string; nama: string; harga: number }, delta: number) => {
    setAddonSelections(prev => {
      const existing = prev.find(a => a.addon_id === addon.id);
      if (existing) {
        const newQty = existing.qty + delta;
        if (newQty <= 0) {
          return prev.filter(a => a.addon_id !== addon.id);
        }
        return prev.map(a => a.addon_id === addon.id ? { ...a, qty: newQty } : a);
      } else {
        if (delta > 0) {
          return [...prev, { addon_id: addon.id, qty: 1, nama: addon.nama, harga: addon.harga }];
        }
        return prev;
      }
    });
  };

  const handleHapusItem = (detailId: string) => {
    if (!orderId) return;
    hapusItem({ id: orderId, detailId });
  };

  const totalBelanja = order?.total_harga || 0;
  const nominalNumber = parseFloat(nominal) || 0;
  const kembalian = Math.max(0, nominalNumber - totalBelanja);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[1100px] w-[90vw] p-0 overflow-hidden bg-[#F6F8F9] border-none rounded-3xl h-[85vh] flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>Checkout Pesanan</DialogTitle>
        </DialogHeader>

        {isLoading || !order ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-white">
            <Loader2 className="w-10 h-10 animate-spin text-[#3874BC]" />
            <p className="text-gray-500 font-medium mt-4">Memuat detail pesanan...</p>
          </div>
        ) : (
          <div className="flex flex-1 h-full overflow-hidden">
            {/* SISI KIRI */}
            {!isPaying ? (
              // VIEW: CART CHECKOUT
              <div className="w-1/2 bg-white flex flex-col h-full rounded-l-3xl">
                <div className="p-8 pb-4">
                  <h2 className="text-[22px] font-bold text-center text-[#1E293B] mb-6">
                    Checkout
                  </h2>

                  {/* Info Pelanggan & Meja */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 bg-slate-100/80 rounded-xl p-3 flex items-center gap-3">
                      <div className="text-orange-700">
                        <User className="size-5 fill-current" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 font-medium">
                          Nama :
                        </span>
                        <span className="text-sm font-semibold text-gray-800">
                          {order.nama_pelanggan}
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
                          {order.nomor_meja}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tipe Pesanan Toggle */}
                  <div className="flex items-center bg-slate-100/80 p-1 rounded-xl mb-6 w-full max-w-[280px] mx-auto">
                    <button
                      onClick={() => updateTipe({ id: order.id, tipe_pesanan: "dine_in" })}
                      disabled={isUpdatingTipe || order.status !== "pending"}
                      className={cn(
                        "flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all",
                        order.tipe_pesanan === "dine_in" || !order.tipe_pesanan
                          ? "bg-white text-orange-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      Dine In
                    </button>
                    <button
                      onClick={() => updateTipe({ id: order.id, tipe_pesanan: "take_away" })}
                      disabled={isUpdatingTipe || order.status !== "pending"}
                      className={cn(
                        "flex-1 py-1.5 text-sm font-semibold rounded-lg transition-all",
                        order.tipe_pesanan === "take_away"
                          ? "bg-white text-orange-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      )}
                    >
                      Take Away
                    </button>
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

                {/* List Order Items */}
                <div className="flex-1 overflow-y-auto px-8 space-y-1">
                  {order.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col px-4 py-3 border-b border-gray-50"
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-5 text-sm font-bold text-gray-800 line-clamp-2 leading-tight">
                          {item.nama}
                        </div>
                        <div className="col-span-3 flex items-center justify-center gap-1">
                          <QtyInput 
                            item={item} 
                            orderId={orderId!} 
                            updateQty={updateQty} 
                            isUpdating={isUpdatingQty} 
                          />
                          <button
                            onClick={() => handleHapusItem(item.id)}
                            disabled={isDeletingItem}
                            title="Hapus Menu"
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="col-span-4 text-sm font-bold text-gray-800 text-center whitespace-nowrap">
                          {formatRp(item.subtotal)}
                        </div>
                      </div>
                      
                      {/* Add-ons rendering */}
                      {item.addons && item.addons.length > 0 && (
                        <div className="mt-2 pl-2 border-l-2 border-orange-200 space-y-1">
                          {item.addons.map((addon) => (
                            <div key={addon.id} className="grid grid-cols-12 gap-4 items-center">
                              <div className="col-span-5 text-[11px] font-medium text-gray-500 truncate">
                                + {addon.nama}
                              </div>
                              <div className="col-span-3 text-[11px] font-medium text-gray-500 text-center">
                                x{addon.qty}
                              </div>
                              <div className="col-span-4 text-[11px] font-medium text-gray-500 text-center whitespace-nowrap">
                                {formatRp(addon.subtotal)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {(!order.items || order.items.length === 0) && (
                    <div className="text-center py-8 text-sm text-gray-400">Belum ada item pesanan</div>
                  )}
                </div>

                {/* Summary & Bayar */}
                <div className="p-8 pt-4 space-y-3 bg-white border-t border-gray-50">
                  <div className="flex items-center justify-between px-6 py-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-semibold text-gray-600">
                      Sub total
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      {formatRp(totalBelanja)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-6 py-3 mb-6">
                    <span className="text-base font-bold text-gray-800">
                      Total
                    </span>
                    <span className="text-base font-bold text-gray-800">
                      {formatRp(totalBelanja)}
                    </span>
                  </div>

                  <div className="flex justify-center pt-2">
                    {order.status === "pending" ? (
                      <Button
                        onClick={handleConfirm}
                        disabled={isConfirming}
                        className="w-[240px] h-12 bg-orange-500 hover:bg-orange-600 rounded-xl text-white font-semibold text-base shadow-sm"
                      >
                        {isConfirming ? (
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                        )}
                        Konfirmasi Pesanan
                      </Button>
                    ) : order.status === "confirmed" ? (
                      <Button
                        onClick={() => setIsPaying(true)}
                        className="w-[240px] h-12 bg-[#3874BC] hover:bg-[#2c5b96] rounded-xl text-white font-semibold text-base shadow-sm"
                      >
                        Lanjut Bayar
                      </Button>
                    ) : (
                      <Button disabled className="w-[240px] h-12 rounded-xl text-base shadow-sm">
                        {order.status_label}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // VIEW: PAYMENT NUMPAD
              <div className="w-1/2 bg-white flex flex-col h-full rounded-l-3xl p-8 pb-4">
                <h2 className="text-[22px] font-bold text-center text-[#1E293B] mb-6">
                  Pembayaran
                </h2>
                
                {/* Ringkasan */}
                <div className="space-y-4 mb-6 px-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-gray-500">Sub total</span>
                    <span className="font-bold text-gray-800">{formatRp(totalBelanja)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-4 pt-4 border-t border-gray-100">
                    <span className="font-bold text-gray-800">Total Dibayar</span>
                    <span className="font-bold text-gray-800">{formatRp(totalBelanja)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-4">
                    <span className="font-bold text-emerald-600">Kembalian</span>
                    <span className="font-bold text-emerald-600">{formatRp(kembalian)}</span>
                  </div>
                </div>

                {/* Input Nominal */}
                <div className="bg-slate-100 rounded-lg p-3 text-center text-lg font-bold text-gray-800 mb-6 mx-4">
                  {formatRp(nominalNumber)}
                </div>

                {/* Numpad */}
                <div className="grid grid-cols-3 gap-3 mb-auto px-4 flex-1">
                  {["7", "8", "9", "4", "5", "6", "1", "2", "3"].map((num) => (
                    <button 
                      key={num} 
                      onClick={() => handleNumpad(num)}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-[#1E293B] shadow-sm text-2xl font-medium rounded-xl py-4 transition-colors"
                    >
                      {num}
                    </button>
                  ))}
                  <button 
                    onClick={() => handleNumpad("000")}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-[#1E293B] shadow-sm text-lg font-bold rounded-xl py-4 transition-colors"
                  >
                    000
                  </button>
                  <button 
                    onClick={() => handleNumpad("0")}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-[#1E293B] shadow-sm text-2xl font-medium rounded-xl py-4 transition-colors"
                  >
                    0
                  </button>
                  <button 
                    onClick={handleBackspace}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-red-500 shadow-sm text-2xl font-medium rounded-xl py-4 transition-colors flex items-center justify-center"
                  >
                    <Delete className="w-6 h-6" />
                  </button>
                </div>

                {/* Aksi */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <Button 
                    onClick={handlePay}
                    disabled={isPayingOrder || nominalNumber < totalBelanja}
                    className="w-[140px] h-12 bg-[#3874BC] hover:bg-[#2c5b96] rounded-xl text-white font-semibold shadow-sm"
                  >
                    {isPayingOrder ? <Loader2 className="w-5 h-5 animate-spin" /> : "Selesaikan"}
                  </Button>
                  <Button 
                    onClick={() => setIsPaying(false)}
                    disabled={isPayingOrder}
                    className="w-[140px] h-12 bg-slate-200 hover:bg-slate-300 rounded-xl text-slate-800 font-semibold shadow-none"
                  >
                    Kembali
                  </Button>
                </div>
              </div>
            )}

            {/* SISI KANAN */}
            {!isPaying ? (
              // VIEW: TAMBAH PESANAN (GALLERY) ATAU ADDON
              <div className="w-1/2 bg-white flex flex-col h-full rounded-r-3xl border-l border-gray-100">
                {selectedMenuForAddon ? (
                  <>
                    <div className="p-8 pb-4 relative">
                      <button 
                        onClick={() => setSelectedMenuForAddon(null)}
                        className="absolute left-6 top-8 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-6 h-6" />
                      </button>
                      <h2 className="text-[22px] font-bold text-center text-[#1E293B] mb-2 px-8">
                        Pilih Add-on
                      </h2>
                      <p className="text-center text-sm font-semibold text-gray-600">
                        {selectedMenuForAddon.nama}
                      </p>
                    </div>
                    <div className="flex-1 overflow-y-auto px-8 pb-4 space-y-3">
                      {selectedMenuForAddon.addons?.map((addon) => {
                        const selectedAddon = addonSelections.find((a) => a.addon_id === addon.id);
                        const qty = selectedAddon ? selectedAddon.qty : 0;
                        return (
                          <div key={addon.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                            <div>
                              <p className="font-bold text-gray-800 text-sm">{addon.nama}</p>
                              <p className="font-medium text-[#3874BC] text-xs">+{formatRp(addon.harga)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              {qty > 0 ? (
                                <>
                                  <button 
                                    onClick={() => handleAddonQty(addon, -1)}
                                    className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-gray-600 hover:bg-slate-200"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="font-semibold text-sm w-4 text-center">{qty}</span>
                                  <button 
                                    onClick={() => handleAddonQty(addon, 1)}
                                    className="w-7 h-7 rounded-full bg-[#3874BC] flex items-center justify-center text-white hover:bg-[#2c5b96]"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <button 
                                  onClick={() => handleAddonQty(addon, 1)}
                                  className="text-xs font-bold text-[#3874BC] border border-[#3874BC] rounded-full px-4 py-1 hover:bg-blue-50"
                                >
                                  Tambah
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="p-6 border-t border-gray-100">
                      <Button
                        onClick={() => handleTambahItem(selectedMenuForAddon.id, selectedMenuForAddon.nama, selectedMenuForAddon.harga, addonSelections)}
                        disabled={isAddingItem || isUpdatingQty}
                        className="w-full h-12 bg-[#3874BC] hover:bg-[#2c5b96] rounded-xl text-white font-semibold"
                      >
                        {isAddingItem ? <Loader2 className="w-5 h-5 animate-spin" /> : "Tambahkan ke Pesanan"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-8 pb-4">
                      <h2 className="text-[22px] font-bold text-center text-[#1E293B] mb-2">
                        Tambah Pesanan
                      </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto px-8 pb-8">
                      {isLoadingMenus ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          <Loader2 className="w-8 h-8 animate-spin text-[#3874BC] mb-2" />
                          <p className="text-sm text-gray-500">Memuat daftar menu...</p>
                        </div>
                      ) : menusError ? (
                        <div className="flex flex-col items-center justify-center h-full text-red-500">
                          <p className="text-sm font-medium">Gagal memuat menu</p>
                        </div>
                      ) : !menus || menus.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          <p className="text-sm">Belum ada menu yang tersedia.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-4">
                          {menus.map((menu) => (
                            <div
                              key={menu.id}
                              className={cn(
                                "flex flex-col bg-white border rounded-2xl overflow-hidden shadow-sm pb-3 transition-shadow relative",
                                menu.is_available ? "border-gray-100 hover:shadow-md" : "border-gray-200 opacity-60 grayscale"
                              )}
                            >
                          <div className="w-full aspect-square bg-slate-100 relative">
                            <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs font-medium">
                              {menu.is_available ? "Gambar Menu" : "Habis"}
                            </div>
                          </div>
                          <div className="px-3 pt-3 flex flex-col items-center text-center space-y-1">
                            <h4 className="text-[11px] font-bold text-gray-800 line-clamp-2 leading-tight">
                              {menu.nama}
                            </h4>
                            <p className="text-[10px] font-bold text-gray-500">
                              {formatRp(menu.harga)}
                            </p>
                            <button 
                              onClick={() => handleKlikAddMenu(menu)}
                              disabled={!menu.is_available || isAddingItem || isUpdatingQty}
                              className="mt-2 text-[10px] font-bold text-[#3874BC] border border-[#3874BC] rounded-md px-4 py-1 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isAddingItem || isUpdatingQty ? "..." : "Add"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
              // VIEW: RINGKASAN MENU (saat di layar pembayaran)
              <div className="w-1/2 bg-white flex flex-col h-full rounded-r-3xl border-l border-gray-100">
                <div className="p-8 pb-4">
                  <h2 className="text-[22px] font-bold text-center text-[#1E293B] mb-6">
                    Menu yang dipesan
                  </h2>
                  <div className="grid grid-cols-12 gap-4 bg-slate-50 px-4 py-3 rounded-t-lg border border-gray-100">
                    <div className="col-span-6 text-sm font-semibold text-gray-400 text-center">Name</div>
                    <div className="col-span-2 text-sm font-semibold text-gray-400 text-center">QTY</div>
                    <div className="col-span-4 text-sm font-semibold text-gray-400 text-center">Price</div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-1">
                  {order.items?.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 px-4 py-4 border border-gray-100 items-center -mt-[1px] hover:bg-slate-50 transition-colors">
                      <div className="col-span-6 text-xs font-bold text-gray-800 line-clamp-2 leading-tight">
                        {item.nama}
                        {item.addons && item.addons.length > 0 && (
                          <span className="block text-[10px] text-gray-400 font-normal mt-0.5">
                            +{item.addons.length} Add-on
                          </span>
                        )}
                      </div>
                      <div className="col-span-2 text-xs font-bold text-gray-800 text-center">x{item.qty}</div>
                      <div className="col-span-4 text-xs font-bold text-gray-800 text-center whitespace-nowrap">
                        {formatRp(item.subtotal)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
