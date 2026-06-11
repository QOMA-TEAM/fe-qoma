import { Button } from "@/components/ui/button"

interface MenuCardProps {
  image: string;
  name: string;
  price: string;
}

export function MenuCard({ image, name, price }: MenuCardProps) {
  return (
    <div className="flex flex-col flex-none w-[120px] bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden snap-start">
      <div className="w-full h-[120px] bg-gray-100 p-1">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      <div className="p-2 flex flex-col items-center">
        <h3 className="font-semibold text-xs text-center text-gray-800 truncate w-full">{name}</h3>
        <p className="text-xs font-bold text-gray-600 mt-0.5">{price}</p>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2 h-7 rounded-full text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300 text-xs px-0"
        >
          Add
        </Button>
      </div>
    </div>
  )
}
