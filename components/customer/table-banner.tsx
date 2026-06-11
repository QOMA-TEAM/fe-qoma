export function TableBanner({ tableNumber }: { tableNumber?: string }) {
  if (!tableNumber) return null;
  
  return (
    <div className="px-4 mt-4">
      <div className="w-full bg-[#fce5c8] rounded-md py-2.5 text-center shadow-sm">
        <p className="text-sm font-medium text-[#c4712b]">
          Table Number : {tableNumber}
        </p>
      </div>
    </div>
  )
}
