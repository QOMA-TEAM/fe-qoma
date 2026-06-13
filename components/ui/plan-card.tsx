import * as React from "react"
import { cn, formatRupiah } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export interface PlanFeature {
  text: React.ReactNode
  icon?: React.ReactNode
}

export interface PlanCardProps {
  name: string
  price: number | React.ReactNode
  period?: string
  description?: React.ReactNode
  features: PlanFeature[]
  
  // Customization Slots
  headerBadge?: React.ReactNode
  actionButton?: React.ReactNode
  priceSubtext?: React.ReactNode
  
  // Styling modifiers
  isActive?: boolean
  className?: string
}

export function PlanCard({
  name,
  price,
  period,
  description,
  features,
  headerBadge,
  actionButton,
  priceSubtext,
  isActive = true,
  className,
}: PlanCardProps) {
  return (
    <Card
      className={cn(
        "w-full border shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden flex flex-col h-full",
        isActive
          ? "bg-white border-gray-200"
          : "border-gray-200 bg-gray-50 opacity-75",
        className
      )}
    >
      <CardContent className="p-6 md:p-8 flex flex-col h-full space-y-6">
        {/* Header: Name + Badge */}
        <div className="flex items-center justify-between gap-4">
          <h3
            className={cn(
              "text-2xl font-bold truncate",
              isActive ? "text-gray-900" : "text-gray-500"
            )}
          >
            {name}
          </h3>
          {headerBadge}
        </div>

        {/* Price */}
        <div>
          {typeof price === "number" ? (
            <div className="flex items-end gap-2">
              <span
                className={cn(
                  "text-4xl font-bold tracking-tight leading-none",
                  isActive ? "text-gray-900" : "text-gray-400"
                )}
              >
                {formatRupiah(price)}
              </span>
              {period && (
                <span className="text-sm font-medium text-gray-500 mb-1">
                  IDR / {period}
                </span>
              )}
            </div>
          ) : (
            price
          )}
          {priceSubtext && <div className="mt-3">{priceSubtext}</div>}
        </div>

        {description && (
          <div className="text-sm text-gray-500 leading-relaxed">
            {description}
          </div>
        )}

        <Separator className={isActive ? "bg-gray-100" : "bg-gray-200"} />

        {/* Features */}
        <ul className="space-y-4 flex-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-sm">
              {feature.icon && (
                <span
                  className={cn(
                    "flex-shrink-0",
                    isActive ? "text-orange-600" : "text-gray-400"
                  )}
                >
                  {feature.icon}
                </span>
              )}
              <span className={isActive ? "text-gray-700 font-medium" : "text-gray-500 font-medium"}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        {/* Actions */}
        {actionButton && (
          <div className="pt-2 mt-auto">
            {actionButton}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
