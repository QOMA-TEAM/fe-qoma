"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Navbar } from "@/components/landing-page/Navbar";
import Image from "next/image";
import Link from "next/link";
import { PricingSection } from "@/components/landing-page/pricing-card";
import { ReviewMarquee } from "@/components/landing-page/review-modal";
import FeaturesSection from "@/components/landing-page/features-modal";

import { AnimatedBackground } from "@/components/animated-background";

// ─── Reusable scroll-reveal wrapper ──────────────────────────────────────────
//
// Setiap section dibungkus komponen ini.
// `from` menentukan arah munculnya: 'bottom' | 'left' | 'right'

interface RevealProps {
  children: React.ReactNode
  from?: "bottom" | "left" | "right"
  delay?: number
  className?: string
}

function Reveal({ children, from = "bottom", delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });

  const initial = {
    bottom: { opacity: 0, y: 48 },
    left: { opacity: 0, x: -48 },
    right: { opacity: 0, x: 48 },
  }[from];

  const animate = isInView
    ? { opacity: 1, y: 0, x: 0 }
    : initial;

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  // Refs untuk tiap section — useInView hanya dipakai di komponen Reveal,
  // tapi footer/reviews butuh ref sendiri karena bukan pakai Reveal.
  const reviewsRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const reviewsInView = useInView(reviewsRef, { once: true, margin: "-80px 0px" });
  const footerInView = useInView(footerRef, { once: true, margin: "-80px 0px" });

  return (
    <div className="min-h-screen bg-[#fff4ec] font-sans relative flex flex-col">

      {/* ── Animated Blob Background ─────────────────────────────────────────── */}
      <AnimatedBackground />

      <Navbar />

      <main className="relative w-full pt-32 flex flex-col items-center" style={{ zIndex: 10 }}>

        {/* ── Hero Section ─────────────────────────────────────────────────── */}
        <section
          id="home"
          className="w-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row justify-between min-h-[calc(100vh-5rem)]"
        >
          {/* Kiri: teks */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 90, damping: 14 }}
            className="flex flex-col justify-center items-start text-left max-w-xl flex-shrink-0 py-20 lg:py-0"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight tracking-tight"
            >
              Kelola Seluruh Cabang{" "}
              <span className="text-[#2563eb]">F&B</span>{" "}
              Anda dalam Satu Platform Cerdas
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-gray-600 mb-10 font-medium"
            >
              SaaS komprehensif untuk memantau operasional, menyinkronkan
              data antar outlet, dan mengendalikan inventaris bahan baku
              secara real-time.
            </motion.p>
          </motion.div>

          {/* Kanan: foto — desktop */}
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 90, damping: 10 }}
            className="hidden lg:flex flex-1 justify-end items-end"
          >
            <Image
              src="/foto1.png"
              alt="Preview Aplikasi"
              width={700}
              height={1400}
              className="w-auto h-[calc(100vh-5rem)] max-h-[1050px] min-h-[580px] object-contain object-bottom drop-shadow-2xl"
              priority
            />
          </motion.div>

          {/* Mobile: foto di bawah teks */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.2 }}
            className="flex lg:hidden justify-center w-full pb-12"
          >
            <Image
              src="/foto1.png"
              alt="Preview Aplikasi"
              width={400}
              height={800}
              className="w-[280px] md:w-[380px] h-auto object-contain drop-shadow-2xl"
              priority
            />
          </motion.div>
        </section>

        {/* ── Features Section ─────────────────────────────────────────────── */}
        {/*
          FeaturesSection adalah komponen external — kita bungkus dengan Reveal
          agar seluruh section slide-up saat masuk viewport.
          Kalau FeaturesSection sudah punya animasi internal sendiri,
          ganti `from="bottom"` ke `from="left"` atau hapus Reveal ini.
        */}
        <Reveal from="bottom" className="w-full">
          <FeaturesSection />
        </Reveal>

        {/* ── Pricing Section ──────────────────────────────────────────────── */}
        {/*
          PricingSection menangani animasinya sendiri (useInView internal),
          jadi tidak perlu dibungkus Reveal.
        */}
        <PricingSection />

        {/* ── Reviews Section ──────────────────────────────────────────────── */}
        <motion.section
          ref={reviewsRef}
          id="reviews"
          className="w-full"
          initial={{ opacity: 0, y: 40 }}
          animate={reviewsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
        >
          <ReviewMarquee />
        </motion.section>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <motion.footer
          ref={footerRef}
          id="contact"
          className="w-full bg-white pt-16 pb-8 border-t border-gray-200"
          initial={{ opacity: 0, y: 32 }}
          animate={footerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
        >
          <div className="w-full max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

              <div className="col-span-1 md:col-span-2">
                <Image
                  src="/logoqoma.svg"
                  alt="Qoma Logo"
                  width={100}
                  height={50}
                  className="mb-6"
                />
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-8">
                  Siap Membawa Bisnis Kuliner Anda ke Level Selanjutnya
                </p>
                <p className="text-gray-400 text-xs font-medium">
                  © 2026 All rights reserved.
                </p>
              </div>

              <div>
                <ul className="space-y-4 text-sm font-medium text-gray-500">
                  {[
                    { label: "Feature", href: "#feature" },
                    { label: "Pricing", href: "#pricing" },
                    { label: "Reviews", href: "#" },
                  ].map(({ label, href }) => (
                    <li key={label}>
                      <Link href={href} className="hover:text-[#ff6b00] transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <ul className="space-y-4 text-sm font-medium text-gray-500">
                  {[
                    "Privacy policy",
                    "Legal",
                    "Terms of service",
                    "Help center",
                  ].map((label) => (
                    <li key={label}>
                      <Link href="#" className="hover:text-[#ff6b00] transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="flex gap-4 mt-8">
                  {["In", "Fb", "X"].map((label) => (
                    <div
                      key={label}
                      className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-[#ff6b00] hover:text-white transition-colors cursor-pointer text-gray-500"
                    >
                      <span className="text-xs font-bold">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </motion.footer>

      </main>
    </div>
  );
}