import { Loader2, Receipt, Clock, User, Table2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePesananDetail } from "@/hooks/outlet/use-pesanan";
import { formatRupiah } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PesananDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pesananId: string;
}

export function PesananDetailDialog({ isOpen, onClose, pesananId }: PesananDetailDialogProps) {
  const { data: detailResponse, isLoading, isError } = usePesananDetail(pesananId);
  const order = detailResponse?.data;

  if (!isOpen) return null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string, label: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white";
    switch (status) {
      case "pending": return <span className={cn(baseClasses, "bg-orange-500")}>{label}</span>;
      case "confirmed": return <span className={cn(baseClasses, "bg-blue-600")}>{label}</span>;
      case "paid": return <span className={cn(baseClasses, "bg-green-600")}>{label}</span>;
      case "cancelled":
      case "expired": return <span className={cn(baseClasses, "bg-red-700")}>{label}</span>;
      default: return <span className={cn(baseClasses, "bg-gray-500")}>{label}</span>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-[#F8FAFC] border-none rounded-2xl flex flex-col max-h-[85vh]">
        <DialogHeader className="bg-white p-6 border-b border-gray-100 flex flex-row items-center justify-between sticky top-0 z-10 shadow-sm">
          <div>
            <DialogTitle className="text-xl font-bold text-gray-800">Detail Pesanan</DialogTitle>
            <p className="text-sm text-gray-500 mt-1">ID: {pesananId.split("-")[0].toUpperCase()}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#3874BC]" />
              <p className="text-gray-500 font-medium mt-4">Memuat data pesanan...</p>
            </div>
          ) : isError || !order ? (
            <div className="text-center py-12 text-red-500 font-medium">
              Gagal memuat detail pesanan.
            </div>
          ) : (
            <>
              {/* Header Info */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Status</span>
                    {getStatusBadge(order.status, order.status_label)}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Tanggal</span>
                    <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {formatDate(order.created_at)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Pelanggan</p>
                      <p className="text-sm font-bold text-gray-800">{order.nama_pelanggan}</p>
                      {order.no_telp && <p className="text-xs text-gray-500 mt-0.5">{order.no_telp}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#3874BC]">
                      <Table2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">No. Meja</p>
                      <p className="text-sm font-bold text-gray-800">{order.nomor_meja || "-"}</p>
                      {order.tipe_pesanan && (
                        <p className="text-[11px] px-1.5 py-0.5 rounded border border-gray-200 text-gray-600 mt-1 inline-block">
                          {order.tipe_pesanan === "dine_in" ? "Dine In" : "Take Away"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-gray-100 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-gray-500" />
                  <h3 className="font-bold text-gray-800">Daftar Menu</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {order.items?.map((item) => (
                    <div key={item.id} className="p-4 flex justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <p className="font-bold text-gray-800 text-sm">{item.nama}</p>
                          <p className="font-bold text-gray-800 text-sm whitespace-nowrap ml-4">
                            {formatRupiah(item.subtotal)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-semibold text-[#3874BC] bg-blue-50 px-2 py-0.5 rounded">x{item.qty}</span>
                          <span className="text-xs text-gray-400">@ {formatRupiah(item.harga)}</span>
                        </div>
                        
                        {item.addons && item.addons.length > 0 && (
                          <div className="mt-2 pl-2 border-l-2 border-orange-200 space-y-1">
                            {item.addons.map((addon) => (
                              <div key={addon.id} className="flex justify-between items-center text-xs text-gray-500">
                                <span>+ {addon.nama} (x{addon.qty})</span>
                                <span>{formatRupiah(addon.subtotal)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!order.items || order.items.length === 0) && (
                    <div className="p-6 text-center text-gray-400 text-sm font-medium">
                      Tidak ada menu dalam pesanan ini.
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Detail (If Paid) */}
              {order.pembayaran && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-emerald-50 px-5 py-3 border-b border-emerald-100 flex items-center gap-2">
                    <h3 className="font-bold text-emerald-800">Rincian Pembayaran</h3>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Metode Pembayaran</span>
                      <span className="font-bold text-gray-800 capitalize">{order.pembayaran.metode}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Waktu Pembayaran</span>
                      <span className="font-bold text-gray-800">{formatDate(order.pembayaran.paid_at)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-100">
                      <span className="text-gray-500 font-medium">Total Tagihan</span>
                      <span className="font-bold text-gray-800">{formatRupiah(order.total_harga)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-medium">Nominal Dibayar</span>
                      <span className="font-bold text-gray-800">{formatRupiah(order.pembayaran.jumlah_bayar)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-3 border-t border-gray-100">
                      <span className="text-emerald-600 font-bold">Kembalian</span>
                      <span className="font-bold text-emerald-600">
                        {formatRupiah(Math.max(0, order.pembayaran.jumlah_bayar - order.total_harga))}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {!isLoading && !isError && order && !order.pembayaran && (
           <div className="bg-white p-5 border-t border-gray-100 mt-auto">
             <div className="flex justify-between items-center">
               <span className="text-gray-500 font-bold">Total Tagihan</span>
               <span className="text-2xl font-black text-gray-900">{formatRupiah(order.total_harga)}</span>
             </div>
           </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
