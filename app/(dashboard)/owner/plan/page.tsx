"use client"

import { useState } from "react"
import { Settings, Bell } from "lucide-react"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { UpgradePlanDialog } from "@/components/plan/upgrade-plan-dialog"

export default function PlanPage() {
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/40">
      {/* Top Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6 shadow-sm">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/owner/dashboard" className="text-sm text-muted-foreground">QOMA</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-sm text-muted-foreground">KELOLA</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-sm">Plan</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center gap-3">
          <button type="button" className="flex items-center justify-center size-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Settings">
            <Settings className="size-4" />
          </button>
          <button type="button" className="relative flex items-center justify-center size-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Notifications">
            <Bell className="size-4" />
            <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-orange-500 ring-2 ring-white" />
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-8 space-y-6">
        {/* Header Text */}
        <div className="pb-4 border-b border-gray-400/50 max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-800">Plan</h2>
          <p className="text-sm text-gray-500 mt-0.5">Mengelola subscription tenant</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          
          {/* Card Free */}
          <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col h-[380px] shadow-sm relative">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Free</h3>
              <Badge variant="outline" className="border-emerald-400 text-emerald-600 bg-emerald-50 rounded-full px-5 text-sm font-medium py-1">
                Aktif
              </Badge>
            </div>
            
            <div className="mb-4">
              <div className="text-[32px] leading-none font-bold text-gray-900 mb-2">Rp. 0</div>
              <div className="text-gray-400 text-[15px] font-medium">Per 30 Hari</div>
            </div>

            <div className="border-t border-gray-800 my-6 w-full" />

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-gray-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></span>
                1 Outlet
              </li>
            </ul>
          </div>

          {/* Card Pro */}
          <div className="bg-[#F9FAFB] rounded-xl border border-gray-200 p-8 flex flex-col h-[380px] shadow-sm relative">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
            </div>
            
            <div className="mb-4">
              <div className="text-[32px] leading-none font-bold text-gray-900 mb-2">Rp. 100.000</div>
              <div className="text-gray-400 text-[15px] font-medium">Per 30 Hari</div>
            </div>

            <div className="border-t border-gray-800 my-6 w-full" />

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-gray-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></span>
                10 Outlet
              </li>
            </ul>

            <button 
              onClick={() => setUpgradeOpen(true)}
              className="w-full mt-auto bg-[#EA580C] hover:bg-[#c2410c] text-white font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer"
            >
              Upgrade Plan
            </button>
          </div>

        </div>
      </main>

      <UpgradePlanDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </div>
  )
}
