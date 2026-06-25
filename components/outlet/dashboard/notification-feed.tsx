import { AlertTriangle, Clock, ShieldAlert, Bug } from "lucide-react"

interface AlertProps {
  alerts?: {
    stok_menipis: Array<{ pesan: string; }>;
    mendekati_expired: Array<{ pesan: string; }>;
    sudah_expired: Array<{ pesan: string; }>;
  };
}

export function NotificationFeed({ alerts }: AlertProps) {
  // Flatten alerts into a single array with types
  const flattenedAlerts = [
    ...(alerts?.sudah_expired?.map(a => ({ ...a, type: 'sudah_expired', icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-100' })) || []),
    ...(alerts?.mendekati_expired?.map(a => ({ ...a, type: 'mendekati_expired', icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' })) || []),
    ...(alerts?.stok_menipis?.map(a => ({ ...a, type: 'stok_menipis', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' })) || [])
  ];

  if (flattenedAlerts.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm h-[400px] flex flex-col">
        <div className="p-6 pb-2">
          <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <Bug className="w-8 h-8 mb-2 opacity-20" />
          <p className="text-sm">Tidak ada notifikasi</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm h-[400px] flex flex-col">
      <div className="p-6 pb-2">
        <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
        {flattenedAlerts.map((notif, idx) => {
          const Icon = notif.icon;
          return (
            <div key={idx} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
              <div className={`${notif.bg} p-1.5 rounded-md mt-0.5`}>
                <Icon className={`w-4 h-4 ${notif.color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-800 leading-snug">{notif.pesan}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Alert</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
