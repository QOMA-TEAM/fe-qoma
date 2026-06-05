"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Store,
  Beef,
  UtensilsCrossed,
  FileBox, // for Stock Opname
  WalletCards, // for Detail Keuangan
  TrendingDown, // for Financial Loss
  Activity, // for Activity Log
  LogOut,
  FolderOpen,
  Home,
  HandPlatter
} from "lucide-react"

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

const outletNav = {
  overview: [
    {
      title: "Dashboard",
      url: "/outlet/dashboard",
      icon: LayoutDashboard,
    },
  ],
  sales: [
    {
      title: "Pesanan Datang",
      url: "/outlet/pesanan-datang",
      icon: FolderOpen,
    },
  ],
  kelola: [
    {
      title: "Bahan Baku",
      url: "/outlet/bahan-baku",
      icon: Beef,
    },
    {
      title: "Menu",
      url: "/outlet/menu",
      icon: UtensilsCrossed,
    },
    {
      title: "Stock Opname",
      url: "/outlet/stock-opname",
      icon: FileBox,
    },
    {
      title: "Meja",
      url: "/outlet/meja",
      icon: HandPlatter,
    },
  ],
  financial: [
    {
      title: "Detail Keuangan",
      url: "/outlet/detail-keuangan",
      icon: WalletCards,
    },
    {
      title: "Activity Log",
      url: "/outlet/activity-log",
      icon: Activity,
    },
  ],
}

export function OutletSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const router = useRouter()

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
            <Link href="/outlet/dashboard" className="flex items-center gap-2">
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
            {outletNav.overview.map((item) => (
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

        {/* SALES */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
            Sales
          </SidebarGroupLabel>
          <SidebarMenu>
            {outletNav.sales.map((item) => (
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
            {outletNav.kelola.map((item) => (
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

        {/* FINANCIAL */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
            Financial
          </SidebarGroupLabel>
          <SidebarMenu>
            {outletNav.financial.map((item) => (
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

      {/* FOOTER: Logout */}
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-red-50 hover:text-red-600">
              <button type="button" className="w-full" onClick={handleLogout}>
                <Avatar className="size-7">
                  <AvatarImage src="/avatar-placeholder.png" alt="Outlet" />
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                    OU
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
    </Sidebar>
  )
}
