"use client"

import { CustomerHeader } from "@/components/customer/header"
import { HeroBanner } from "@/components/customer/hero-banner"
import { TableBanner } from "@/components/customer/table-banner"
import { HorizontalScroll } from "@/components/customer/horizontal-scroll"
import { MenuCard } from "@/components/customer/menu-card"
import { CategoryList } from "@/components/customer/category-list"

// Dummy data
const dummyItems = [
  { id: 1, name: "Bakso Goreng", price: "Rp. 12.000", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop" },
  { id: 2, name: "Bakso Goreng", price: "Rp. 12.000", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop" },
  { id: 3, name: "Bakso Goreng", price: "Rp. 12.000", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop" },
  { id: 4, name: "Bakso Goreng", price: "Rp. 12.000", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop" },
  { id: 5, name: "Bakso Goreng", price: "Rp. 12.000", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop" },
]

export default function CustomerMenuPage() {
  return (
    <>
      <CustomerHeader />
      <div className="pb-8">
        <HeroBanner />
        <TableBanner tableNumber="38" />
        
        <HorizontalScroll title="New Menu">
          {dummyItems.map((item) => (
            <MenuCard key={`new-${item.id}`} {...item} />
          ))}
        </HorizontalScroll>

        <HorizontalScroll title="Foods For You">
          {dummyItems.map((item) => (
            <MenuCard key={`food-${item.id}`} {...item} />
          ))}
        </HorizontalScroll>

        <HorizontalScroll title="Drinks For You">
          {dummyItems.map((item) => (
            <MenuCard key={`drink-${item.id}`} {...item} />
          ))}
        </HorizontalScroll>

        <HorizontalScroll title="Best Of The Best">
          {dummyItems.map((item) => (
            <MenuCard key={`best-${item.id}`} {...item} />
          ))}
        </HorizontalScroll>

        <CategoryList />
      </div>
    </>
  )
}
