import { Bug } from "lucide-react"

export function NotificationFeed() {
  const notifications = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    text: "Stok Ayam Geprek kurang dari 2",
    time: "Just now"
  }))

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm h-[600px] flex flex-col">
      <div className="p-6 pb-2">
        <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
        {notifications.map((notif) => (
          <div key={notif.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
            <div className="bg-gray-100 p-1.5 rounded-md mt-0.5">
              <Bug className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-800 leading-snug">{notif.text}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{notif.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
