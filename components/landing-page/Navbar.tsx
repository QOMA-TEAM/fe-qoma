"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { name: "Home", href: "/#home" },
  { name: "Feature", href: "/#feature" },
  { name: "Pricing", href: "/#pricing" },
  { name: "Review", href: "/#reviews" },
  { name: "Contact", href: "/#contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-full flex items-center justify-between py-6 px-8 md:px-16 fixed top-0 left-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/60 backdrop-blur-md shadow-sm py-4" : "bg-transparent"
        }`}
    >
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

      {/* Right side - Login and Start Free Button */}
      <div className="flex items-center gap-4">
        <Link
          href="/register"
          className="px-6 py-2.5 bg-[#1D5E84] text-white rounded-full font-semibold text-sm hover:bg-[#154562] transition-all shadow-sm hover:shadow-md"
        >
          Start Free
        </Link>
        <Link
          href="/login"
          className="px-6 py-2.5 bg-[#FB6300] text-white rounded-full font-semibold text-sm hover:bg-[#D75500] transition-all shadow-sm hover:shadow-md"
        >
          Login
        </Link>
      </div>

    </nav>
  );
}