import { Utensils, Trash2, ArrowRight } from "lucide-react"

interface Order {
  id: string
  nama: string
  meja: string
  status: "Unpaid" | "Paid"
}

const dummyOrders: Order[] = [
  { id: "A4104", nama: "Surikiti", meja: "04", status: "Unpaid" },
  { id: "A4104", nama: "Surikiti", meja: "04", status: "Unpaid" },
  { id: "A4104", nama: "Surikiti", meja: "04", status: "Unpaid" },
]

export function IncomingOrders() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Pesanan Datang</h3>
        <button className="text-sm font-semibold text-gray-700 hover:text-black flex items-center gap-1">
          Tampilkan Semua <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {dummyOrders.map((order, idx) => (
          <div key={idx} className="flex h-28 rounded-xl overflow-hidden shadow-sm bg-[#1a5f7a]">
            {/* Left Icon Strip */}
            <div className="w-16 flex-shrink-0 flex items-center justify-center">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            
            {/* Right Content */}
            <div className="flex-1 bg-white m-1 rounded-lg p-4 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[#1a5f7a]">ID : {order.id}</span>
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                  {order.status}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-12 text-sm">
                    <span className="text-[#1a5f7a] font-medium w-16">Nama</span>
                    <span className="text-[#1a5f7a]">{order.nama}</span>
                  </div>
                  <div className="flex items-center gap-12 text-sm">
                    <span className="text-[#1a5f7a] font-medium w-16">No. Meja</span>
                    <span className="text-[#1a5f7a]">{order.meja}</span>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
