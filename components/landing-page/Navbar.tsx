"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Feature", href: "/#feature" },
  { name: "Screenshot", href: "/#screenshot" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Contact", href: "/#contact" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full flex items-center justify-between py-6 px-8 md:px-16 absolute top-0 left-0 z-50">
      <div className="flex items-center gap-12">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-center justify-center font-black leading-none text-xl tracking-tighter">
          <div className="flex gap-1">
            <span className="text-blue-600">Q</span>
            <span className="text-blue-500">I</span>
            <span className="text-blue-600">P</span>
          </div>
          <div className="flex gap-1">
            <span className="text-orange-500">A</span>
            <span className="text-blue-500">I</span>
            <span className="text-orange-600">M</span>
          </div>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:text-orange-500 transition-colors">
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
