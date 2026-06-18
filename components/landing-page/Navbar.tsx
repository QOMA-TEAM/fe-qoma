"use client";

import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { name: "Home", href: "/#home" },
  { name: "Feature", href: "/#feature" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Contact", href: "/#contact" },
];

export function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between py-6 px-8 md:px-16 fixed top-0 left-0 z-50 bg-white/40 backdrop-blur-sm">
      <div className="flex items-center gap-12">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center">
          <Image src="/logoqoma.svg" alt="Qoma Logo" width={80} height={40} className="object-contain" />
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-800">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="hover:text-[#ff6b00] transition-colors">
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Right side - Start Free Button */}
      <div className="flex items-center">
        <Link
          href="/register"
          className="px-6 py-2.5 bg-[#1D5E84] text-white rounded-full font-semibold text-sm hover:bg-[#154562] transition-all shadow-sm hover:shadow-md"
        >
          Start Free
        </Link>
      </div>
    </nav>
  );
}