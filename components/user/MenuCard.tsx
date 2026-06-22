import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/components/user/MenuDetailModal";

export function MenuCard({
  item,
  onClick,
}: {
  item: MenuItem;
  onClick: (item: MenuItem) => void;
}) {
  const [imgSrc, setImgSrc] = useState(item.image);

  useEffect(() => {
    setImgSrc(item.image);
  }, [item.image]);

  const isAvailable = item.is_available !== false; // Default true if undefined

  return (
    <div
      className={`group border border-gray-100 rounded-xl overflow-hidden shadow-sm flex flex-col h-full transition-all duration-200 
                 ${isAvailable ? "bg-white hover:shadow-md hover:-translate-y-0.5 cursor-pointer" : "bg-gray-100 opacity-75 cursor-not-allowed"}`}
      onClick={() => isAvailable && onClick(item)}
    >
      <div className="relative w-full aspect-square md:aspect-[4/3] bg-gray-50 flex items-center justify-center shrink-0">
        <Image 
          src={imgSrc} 
          alt={item.name} 
          fill 
          className={imgSrc === "/logoqoma.svg" ? "object-contain p-4 opacity-50" : "object-cover"} 
          onError={() => setImgSrc("/logoqoma.svg")}
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-gray-500/50 flex items-center justify-center backdrop-blur-[1px]">
            <span className="bg-gray-800 text-white font-bold px-3 py-1 rounded-full text-xs shadow-md">Habis</span>
          </div>
        )}
      </div>
      <div className="p-2 md:p-3 flex flex-col flex-1">
        <p className="font-semibold text-gray-800 text-xs md:text-sm truncate leading-snug">
          {item.name}
        </p>
        <p className="hidden md:block text-gray-400 text-xs truncate mt-0.5">
          {item.description}
        </p>
        <div className="mt-auto">
          <p className="text-gray-700 text-xs md:text-sm font-medium mt-1 mb-1.5">
            Rp. {item.price.toLocaleString("id-ID")}
          </p>
          <Button
            variant="outline"
            size="sm"
            disabled={!isAvailable}
            className={`mt-1.5 w-full text-xs h-7 md:h-8 border-orange-300 text-orange-500 transition-colors
                       ${isAvailable ? "hover:bg-orange-500 hover:text-white hover:border-orange-500" : "opacity-50 cursor-not-allowed border-gray-300 text-gray-500"}`}
            onClick={(e) => {
              if (isAvailable) {
                e.stopPropagation();
                onClick(item);
              }
            }}
          >
            {isAvailable ? "Add" : "Habis"}
          </Button>
        </div>
      </div>
    </div>
  );
}
