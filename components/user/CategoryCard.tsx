import Image from "next/image";

export function CategoryCard({
  name,
  onClick,
}: {
  name: string;
  onClick: (name: string) => void;
}) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer group h-36 md:h-44 bg-white border border-gray-100 flex items-center justify-center p-4"
      onClick={() => onClick(name)}
    >
      <Image
        src="/logoqoma.svg"
        alt={name}
        width={64}
        height={64}
        className="opacity-50 group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <span className="absolute bottom-3 left-4 text-white font-bold text-sm uppercase tracking-wide">
        {name}
      </span>
    </div>
  );
}
