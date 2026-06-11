import { ShoppingBasket } from "lucide-react"

export function CustomerHeader() {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
          <span className="text-orange-600 font-bold text-sm">PM</span>
        </div>
        <h1 className="font-bold text-gray-800">Pizza Mizna</h1>
      </div>
      <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center relative cursor-pointer">
        <ShoppingBasket className="w-5 h-5 text-orange-600" />
      </div>
    </header>
  )
}
