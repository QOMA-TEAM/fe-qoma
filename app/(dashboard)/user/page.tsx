// app/(dashboard)/user/page.tsx
"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { UserDashboardContent } from "@/components/user/dashboard/UserDashboardContent";

export default function UserDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      }
    >
      <UserDashboardContent />
    </Suspense>
  );
}
