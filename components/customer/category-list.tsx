export function CategoryList() {
  const categories = [
    {
      id: 1,
      name: "OLAHAN WESTERN",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "OLAHAN WESTERN",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "OLAHAN WESTERN",
      image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 4,
      name: "OLAHAN WESTERN",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop",
    }
  ]

  return (
    <div className="mt-6 px-4 pb-8">
      <h2 className="text-sm font-bold text-gray-800 mb-3">Category List</h2>
      
      <div className="flex flex-col gap-4">
        {categories.map((category) => (
          <div key={category.id} className="w-full">
            <div className="w-full h-[100px] overflow-hidden rounded-md shadow-sm border border-gray-100">
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[10px] font-bold text-gray-800 mt-1 uppercase">
              {category.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
