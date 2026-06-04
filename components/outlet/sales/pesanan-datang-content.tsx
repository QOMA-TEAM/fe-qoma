"use client";

import { OrderCard, type OrderData } from "@/components/outlet/sales/order-card";

// Generate 12 dummy orders to match the design (4 rows of 3)
const dummyOrders: OrderData[] = Array.from({ length: 12 }).map(() => ({
  id: "A4104",
  nama: "Surikiti",
  meja: "04",
  status: "Unpaid",
}));

export function PesananDatangContent() {
  const handleDelete = (id: string) => {
    // Akan diimplementasikan nanti
    console.log("Delete order", id);
  };

  return (
    <main className="flex-1 overflow-auto p-8 bg-[#F8FAFC]">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Section Title */}
        <div>
          <h2 className="text-[24px] font-bold text-[#1E293B]">Pesanan Datang</h2>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {dummyOrders.map((order, idx) => (
            <OrderCard key={idx} order={order} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </main>
  );
}
