import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { OrderCard, type OrderData } from "@/components/outlet/sales/order-card"

const dummyOrders: OrderData[] = [
  { id: "A4104", nama: "Surikiti", meja: "04", status: "Unpaid" },
  { id: "A4104", nama: "Surikiti", meja: "04", status: "Unpaid" },
  { id: "A4104", nama: "Surikiti", meja: "04", status: "Unpaid" },
]

export function IncomingOrders() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Pesanan Datang</h3>
        <Link 
          href="/outlet/pesanan-datang"
          className="text-sm font-semibold text-gray-700 hover:text-black flex items-center gap-1 transition-colors"
        >
          Tampilkan Semua <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {dummyOrders.map((order, idx) => (
          <OrderCard key={idx} order={order} />
        ))}
      </div>
    </div>
  )
}
