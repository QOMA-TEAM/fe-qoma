import React from "react"

export default function CustomerMenuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-sm relative overflow-hidden">
        {children}
      </div>
    </div>
  )
}
