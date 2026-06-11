import { ChevronRight } from "lucide-react"

export function HeroBanner() {
  return (
    <div className="relative">
      <div className="w-full h-48 bg-gray-200">
        <img
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop"
          alt="Pizza Hero"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Pizza Mizna</h2>
            <p className="text-gray-500 text-sm font-medium">Open today, 10:00 - 22:00</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  )
}
