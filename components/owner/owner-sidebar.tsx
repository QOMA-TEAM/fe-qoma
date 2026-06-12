"use client"

import * as React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Store,
  Beef,
  UtensilsCrossed,
  Tags,
  CircleDollarSign,
  CreditCard,
  LogOut,
  ClipboardCheck,
  FileCheck,
  Settings,
  ListPlus,
} from "lucide-react"

import { ChangePasswordDialog } from "@/components/settings/change-password-dialog"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const ownerNav = {
  overview: [
    {
      title: "Dashboard",
      url: "/owner/dashboard",
      icon: LayoutDashboard,
    },
  ],
  kelola: [
    {
      title: "Kategori",
      url: "/owner/kategori",
      icon: Tags,
    },
    {
      title: "Bahan Baku",
      url: "/owner/bahan-baku",
      icon: Beef,
    },
    {
      title: "Menu",
      url: "/owner/menu",
      icon: UtensilsCrossed,
    },
    {
      title: "Add On",
      url: "/owner/addon",
      icon: ListPlus,
    },
    {
      title: "Outlet",
      url: "/owner/outlet",
      icon: Store,
    },
    {
      title: "Plan",
      url: "/owner/plan",
      icon: CreditCard,
    },
  ],approval: [
    {
      title: "Approve Bahan Baku",
      url: "/owner/approval-bahan",
      icon: ClipboardCheck,
    },
      {
      title: "Approval Menu",
      url: "/owner/approval-menu",
      icon: FileCheck,
    },
  ],
  keuangan: [
    {
      title: "Detail",
      url: "/owner/keuangan",
      icon: CircleDollarSign,
    },
  ],
  laporan: [
    {
      title: "Activity Log",
      url: "/owner/activity-log",
      icon: ClipboardCheck,
    },
    {
      title: "Stock Opname",
      url: "/owner/stock-opname",
      icon: ClipboardCheck,
    },
  ],
}

export function OwnerSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("role")
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax"
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax"
    router.push("/login")
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/owner/dashboard" className="flex items-center gap-2">
              <Image
                src="/logoqoma.svg"
                alt="QOMA Logo"
                width={56}
                height={56}
                priority
              />
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* OVERVIEW */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
            Overview
          </SidebarGroupLabel>
          <SidebarMenu>
            {ownerNav.overview.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  className="data-[active=true]:bg-slate-100 data-[active=true]:text-orange-500 data-[active=true]:font-bold hover:bg-slate-50"
                >
                  <Link href={item.url}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* KELOLA */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
            Kelola
          </SidebarGroupLabel>
          <SidebarMenu>
            {ownerNav.kelola.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  className="data-[active=true]:bg-slate-100 data-[active=true]:text-orange-500 data-[active=true]:font-bold hover:bg-slate-50"
                >
                  <Link href={item.url}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* APPROVAL */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
            Approval
          </SidebarGroupLabel>
          <SidebarMenu>
            {ownerNav.approval.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  className="data-[active=true]:bg-slate-100 data-[active=true]:text-orange-500 data-[active=true]:font-bold hover:bg-slate-50"
                >
                  <Link href={item.url}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>


        {/* KEUANGAN */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
            Keuangan
          </SidebarGroupLabel>
          <SidebarMenu>
            {ownerNav.keuangan.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  className="data-[active=true]:bg-slate-100 data-[active=true]:text-orange-500 data-[active=true]:font-bold hover:bg-slate-50"
                >
                  <Link href={item.url}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* LAPORAN */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
            Laporan
          </SidebarGroupLabel>
          <SidebarMenu>
            {ownerNav.laporan.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  className="data-[active=true]:bg-slate-100 data-[active=true]:text-orange-500 data-[active=true]:font-bold hover:bg-slate-50"
                >
                  <Link href={item.url}>
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER: Logout & Settings */}
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-slate-100 hover:text-slate-900 cursor-pointer">
              <button type="button" className="w-full cursor-pointer" onClick={() => setIsSettingsOpen(true)}>
                <Settings className="size-4" />
                <span>Setting</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-red-50 hover:text-red-600 cursor-pointer">
              <button type="button" className="w-full cursor-pointer" onClick={handleLogout}>
                <Avatar className="size-7">
                  <AvatarImage src="/avatar-placeholder.png" alt="Owner" />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                    OW
                  </AvatarFallback>
                </Avatar>
                <span>Logout</span>
                <LogOut className="ml-auto size-4" />
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
      
      <ChangePasswordDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </Sidebar>
  )
}
