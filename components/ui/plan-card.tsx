"use client"

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
  headerBadge?: React.ReactNode
  actionButton?: React.ReactNode
  priceSubtext?: React.ReactNode
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
  const [hovered, setHovered] = React.useState(false)

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: hovered
          ? '0 8px 28px 0 rgba(251,99,0,0.28), 0 2px 8px 0 rgba(251,99,0,0.14)'
          : '0 1px 3px 0 rgba(0,0,0,0.08)',
        outline: hovered ? '2px solid #FB6300' : '2px solid transparent',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease, outline 0.22s ease',
        height: '100%',
      }}
      className={cn(
        "w-full border rounded-2xl overflow-hidden flex flex-col",
        isActive
          ? "bg-white border-gray-200"
          : "border-gray-200 bg-gray-50 opacity-75",
        className
      )}
    >
      <CardContent className="p-6 md:p-8 flex flex-col flex-1">
        {/* Top Content: Stretches to push everything else down */}
        <div className="flex-1 flex flex-col space-y-6">
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
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span
                className={cn(
                  "text-4xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-none",
                  isActive ? "text-gray-900" : "text-gray-400"
                )}
              >
                {formatRupiah(price)}
              </span>
              {period && (
                <span className="text-sm font-medium text-gray-500">
                  / {period}
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
        </div>

        {/* Bottom Content: Always at the bottom */}
        <div className="mt-6 flex flex-col space-y-6">
          <Separator className={isActive ? "bg-gray-100" : "bg-gray-200"} />

          {/* Features */}
          <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-sm">
              {feature.icon && (
                <span className="flex-shrink-0">
                  {feature.icon}
                </span>
              )}
              <span className={isActive ? "text-gray-700 font-medium" : "text-gray-500 font-medium"}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>

        {/* Action — selalu di bawah */}
        {actionButton && (
          <div className="pt-2">
            {actionButton}
          </div>
        )}
        </div>
      </CardContent>
    </Card>
  )
}