"use client";

import { Navbar } from "@/components/landing-page/Navbar";
import Image from "next/image";
import Link from "next/link";
import { PricingSection } from "@/components/landing-page/pricing-card";
import { ReviewMarquee } from "@/components/landing-page/review-modal";
import { motion } from "motion/react";
import { use } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fff4ec] font-sans relative overflow-x-hidden">
      <Navbar />

      {/* Background decorations */}
      <div className="absolute top-[-5%] right-[-10%] w-[800px] h-[800px] bg-[#ff6b00] rounded-[100px] rotate-45 blur-[4px] z-0 opacity-90 hidden md:block" style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#ff6b00]/10 to-transparent z-0"></div>

      <main className="relative z-10 w-full pt-32 flex flex-col items-center">

        {/* --- Hero Section --- */}
        <section id="home" className="w-full max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12 pb-20">

          {/* Kiri: Teks deskripsi — fade in + slide dari kiri (bouncy), sekali saja saat mount */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 90, damping: 14 }}
            className="flex flex-col items-start text-left max-w-xl"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight"
            >
              Kelola Seluruh Cabang <span className="text-[#2563eb]">F&B</span> Anda dalam Satu Platform Cerdas
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-gray-600 mb-10 font-medium"
            >
              SaaS komprehensif untuk memantau operasional, menyinkronkan data antar outlet, dan mengendalikan inventaris bahan baku secara real-time.
            </motion.p>
          </motion.div>

          {/* Kanan: Foto — diperbesar, animasi bouncy sekali saja */}
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 90, damping: 10 }}
            className="w-full lg:w-auto flex justify-center lg:justify-end shrink-0"
          >
            <Image
              src="/foto1.png"
              alt="Preview Aplikasi"
              width={500}
              height={1000}
              className="w-[300px] md:w-[420px] lg:w-[500px] h-auto object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>
        </section>

        {/* --- Features Section --- */}
        <section id="feature" className="w-full bg-white relative py-24">
          {/* subtle grid background */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]"></div>

          <div className="w-full max-w-6xl mx-auto px-6 relative z-10">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Features</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-[#ff6b00] -translate-y-1/2 z-0"></div>

              {/* Feature 1 */}
              <div className="bg-[#2a201a] text-white p-8 rounded-2xl relative z-10 shadow-xl border border-[#ff6b00]/30 transform hover:-translate-y-2 transition-transform">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>1.</span> POS & Manajemen Pesanan
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Atur Menu, Harga, dan Diskon
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#2a201a] text-white p-8 rounded-2xl relative z-10 shadow-xl border border-[#ff6b00]/30 transform hover:-translate-y-2 transition-transform mt-0 md:mt-12">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>2.</span> Sistem Inventaris
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Lacak stok bahan baku secara real-time. Cegah out-of-stock dengan peringatan otomatis sebelum bahan habis.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#2a201a] text-white p-8 rounded-2xl relative z-10 shadow-xl border border-[#ff6b00]/30 transform hover:-translate-y-2 transition-transform">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>3.</span> Laporan & Analitik Terintegrasi
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Bandingkan performa antar cabang dan ambil keputusan strategis berdasarkan data yang akurat.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-[#2a201a] text-white p-8 rounded-2xl relative z-10 shadow-xl border border-[#ff6b00]/30 transform hover:-translate-y-2 transition-transform">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>4.</span> Multienant
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Pantau performa, atur menu, dan kelola akses karyawan untuk ribuan outlet berbeda hanya dari satu dashboard utama.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Pricing Section --- */}
        <PricingSection />

        {/* --- Reviews Section --- */}
        <section id="reviews" className="w-full">
          <ReviewMarquee />
        </section>

        {/* --- Contact / Footer --- */}
        <footer id="contact" className="w-full bg-white pt-16 pb-8 border-t border-gray-200">
          <div className="w-full max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-1 md:col-span-2">
                <Image src="/logoqoma.svg" alt="Qoma Logo" width={100} height={50} className="mb-6" />
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-8">
                  Siap Membawa Bisnis Kuliner Anda ke Level Selanjutnya
                </p>
                <p className="text-gray-400 text-xs font-medium">
                  © 2026 All rights reserved.
                </p>
              </div>

              <div>
                <ul className="space-y-4 text-sm font-medium text-gray-500">
                  <li><Link href="#feature" className="hover:text-[#ff6b00] transition-colors">Feature</Link></li>
                  <li><Link href="#pricing" className="hover:text-[#ff6b00] transition-colors">Pricing</Link></li>
                  <li><Link href="#" className="hover:text-[#ff6b00] transition-colors">Reviews</Link></li>
                </ul>
              </div>

              <div>
                <ul className="space-y-4 text-sm font-medium text-gray-500">
                  <li><Link href="#" className="hover:text-[#ff6b00] transition-colors">Privacy policy</Link></li>
                  <li><Link href="#" className="hover:text-[#ff6b00] transition-colors">Legal</Link></li>
                  <li><Link href="#" className="hover:text-[#ff6b00] transition-colors">Terms of service</Link></li>
                  <li><Link href="#" className="hover:text-[#ff6b00] transition-colors">Help center</Link></li>
                </ul>

                {/* Social Icons (Placeholder blocks) */}
                <div className="flex gap-4 mt-8">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-[#ff6b00] hover:text-white transition-colors cursor-pointer text-gray-500">
                    <span className="text-xs font-bold">In</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-[#ff6b00] hover:text-white transition-colors cursor-pointer text-gray-500">
                    <span className="text-xs font-bold">Fb</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-[#ff6b00] hover:text-white transition-colors cursor-pointer text-gray-500">
                    <span className="text-xs font-bold">X</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
