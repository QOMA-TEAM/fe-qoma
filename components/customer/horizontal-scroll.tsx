interface HorizontalScrollProps {
  title: string;
  children: React.ReactNode;
}

export function HorizontalScroll({ title, children }: HorizontalScrollProps) {
  return (
    <div className="mt-6">
      <h2 className="px-4 text-sm font-bold text-gray-800 mb-3">{title}</h2>
      
      {/* Scrollable container */}
      <div className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x snap-mandatory hide-scrollbar">
        {children}
      </div>
    </div>
  )
}
