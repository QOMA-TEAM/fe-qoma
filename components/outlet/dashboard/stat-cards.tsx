import { Store, Coins, TrendingDown, CircleDollarSign } from "lucide-react"
import type { KeuanganSummary } from "@/services/outlet/dashboard-service"
import { formatRupiah } from "@/lib/utils"

interface OutletStatCardsProps {
  keuangan?: KeuanganSummary;
}

export function OutletStatCards({ keuangan }: OutletStatCardsProps) {
  const totalPendapatan = keuangan?.total_pendapatan ?? 0;
  const totalPengeluaran = keuangan?.total_pengeluaran ?? 0;
  const totalKeuntunganRaw = keuangan?.total_keuntungan ?? 0;
  
  const displayKeuntungan = totalKeuntunganRaw > 0 ? totalKeuntunganRaw : 0;
  const displayKerugian = totalKeuntunganRaw < 0 ? Math.abs(totalKeuntunganRaw) : (keuangan?.total_kerugian ?? 0);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">For Your Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pendapatan: Blue */}
        <div className="bg-[#2A49B8] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium opacity-90">Total Pendapatan</span>
          </div>
          <h3 className="text-2xl font-bold">{formatRupiah(totalPendapatan)}</h3>
          <Store className="absolute -bottom-6 -right-4 w-28 h-28 text-white/10" />
        </div>

         {/* Keuntungan: Green */}
        <div className="bg-[#29A364] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <CircleDollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium opacity-90">Total Keuntungan</span>
          </div>
          <h3 className="text-2xl font-bold">{formatRupiah(displayKeuntungan)}</h3>
          <CircleDollarSign className="absolute -bottom-6 -right-4 w-28 h-28 text-white/10" />
        </div>

        {/* Pengeluaran: Orange */}
        <div className="bg-[#F29C38] text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Coins className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium opacity-90">Total Pengeluaran</span>
          </div>
          <h3 className="text-2xl font-bold">{formatRupiah(totalPengeluaran)}</h3>
          <Coins className="absolute -bottom-6 -right-4 w-28 h-28 text-white/10" />
        </div>

        {/* Kerugian: Red */}
        <div className="bg-rose-500 text-white p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium opacity-90">Total Kerugian</span>
          </div>
          <h3 className="text-2xl font-bold">{formatRupiah(displayKerugian)}</h3>
          <TrendingDown className="absolute -bottom-6 -right-4 w-28 h-28 text-white/10" />
        </div>

       
      </div>
    </div>
  )
}