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

  return (
    <div
      className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm 
                 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
      onClick={() => onClick(item)}
    >
      <div className="relative w-full aspect-square md:aspect-[4/3] bg-gray-50 flex items-center justify-center">
        <Image 
          src={imgSrc} 
          alt={item.name} 
          fill 
          className={imgSrc === "/logoqoma.svg" ? "object-contain p-4 opacity-50" : "object-cover"} 
          onError={() => setImgSrc("/logoqoma.svg")}
        />
      </div>
      <div className="p-2 md:p-3">
        <p className="font-semibold text-gray-800 text-xs md:text-sm truncate leading-snug">
          {item.name}
        </p>
        <p className="hidden md:block text-gray-400 text-xs truncate mt-0.5">
          {item.description}
        </p>
        <p className="text-gray-700 text-xs md:text-sm font-medium mt-1">
          Rp. {item.price.toLocaleString("id-ID")}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-1.5 w-full text-xs h-7 md:h-8 border-orange-300 text-orange-500 
                     hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClick(item);
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
