"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing-page/Navbar";
import { useRouter } from "next/navigation";
import { CheckCircle2, Zap, Star, CreditCard, Wallet, Eye, EyeOff } from "lucide-react";

type Plan = "free" | "pro" | null;

export function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "gopay">("card");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const TOTAL_STEPS = 4;

  const handleNext = () => {
    if (step === 1 && !selectedPlan) return;
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      alert("Form submitted! Menunggu konfirmasi superadmin.");
      router.push("/");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const stepLabels = ["Pilih Paket", "Buat Akun", "Data Perusahaan", "Pembayaran"];

  // ── Plan card colours ─────────────────────────────────────────────────────
  const isFreePlan = selectedPlan === "free";
  const planAccent = isFreePlan ? "#ff6b00" : "#3874BC";
  const planBg = isFreePlan ? "#fff4ec" : "#dde8f7";
  const planName = isFreePlan ? "Free" : "Pro";
  const planPrice = isFreePlan ? "Rp 0" : "Rp 100.000";
  const planPeriod = "/ 30 Hari";
  const planFeatures = isFreePlan
    ? ["1 Outlet", "3 Pengguna", "Laporan bulanan", "Stock dasar"]
    : ["3 Outlet", "20 Pengguna", "Laporan real-time", "Stock opname", "Multi-kasir"];

  return (
    <div className="min-h-screen bg-[#fff4ec] relative font-sans flex flex-col">
      <Navbar />

      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#ff6b00] rounded-full blur-[2px] opacity-90 z-0" />

      <main className="relative z-10 flex-1 flex items-center justify-center pt-24 pb-12 px-4">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl p-10 md:p-14 min-h-[560px] flex flex-col relative">

          {/* ── Step Indicator ─────────────────────────────────────────────── */}
          <div className="flex items-center justify-center mb-8 gap-0">
            {stepLabels.map((label, idx) => {
              const num = idx + 1;
              const isActive = step === num;
              const isCompleted = step > num;
              return (
                <div key={num} className="flex items-center">
                  {/* Node */}
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center text-base font-semibold transition-colors duration-300 ${isActive
                        ? "bg-[#ff6b00] text-white shadow-md shadow-orange-200"
                        : isCompleted
                          ? "bg-[#ff6b00]/20 text-[#ff6b00]"
                          : "bg-[#eef2f6] text-gray-400"
                        }`}
                    >
                      {isCompleted ? <CheckCircle2 size={20} /> : num}
                    </div>
                    <span
                      className={`text-xs font-medium whitespace-nowrap ${isActive ? "text-[#ff6b00]" : isCompleted ? "text-[#ff6b00]/70" : "text-gray-400"
                        }`}
                    >
                      {label}
                    </span>
                  </div>

                  {/* Connector line (not after last) */}
                  {num < TOTAL_STEPS && (
                    <div className="w-16 md:w-24 h-1.5 rounded-full bg-[#eef2f6] mx-3 overflow-hidden mt-[-14px]">
                      <div
                        className="h-full bg-[#ff6b00] transition-all duration-500"
                        style={{ width: step > num ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Orange Divider */}
          <div className="h-[3px] w-full bg-[#ff6b00] mb-10 rounded-full" />

          {/* ── Step Content ───────────────────────────────────────────────── */}
          <div className="flex-1">

            {/* STEP 1 — Pilih Paket */}
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Pilih Paket</h2>
                <p className="text-gray-500 text-sm mb-8">Mulai gratis, upgrade kapan saja sesuai kebutuhan bisnismu.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                  {/* Free Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedPlan("free")}
                    className={`text-left rounded-2xl border-2 p-6 transition-all duration-200 cursor-pointer ${selectedPlan === "free"
                      ? "border-[#ff6b00] bg-[#fff4ec] shadow-md shadow-orange-100"
                      : "border-gray-200 bg-white hover:border-[#ff6b00]/40"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                        <Zap size={11} /> Starter
                      </span>
                      {selectedPlan === "free" && (
                        <span className="text-[#ff6b00]">
                          <CheckCircle2 size={20} />
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-0.5">Free</p>
                    <p className="text-sm text-gray-400 mb-4">Rp 0 <span className="text-xs">/ 30 Hari</span></p>
                    <p className="text-xs text-gray-500 mb-5">Cocok untuk kamu yang baru mulai mengelola bisnis F&B pertama.</p>
                    <ul className="space-y-2">
                      {["1 Outlet", "3 Pengguna", "Laporan bulanan", "Stock dasar"].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 size={14} className="text-gray-400 flex-shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </button>

                  {/* Pro Card */}
                  <button
                    type="button"
                    onClick={() => setSelectedPlan("pro")}
                    className={`text-left rounded-2xl border-2 p-6 transition-all duration-200 cursor-pointer ${selectedPlan === "pro"
                      ? "border-[#3874BC] bg-[#dde8f7] shadow-md shadow-blue-100"
                      : "border-gray-200 bg-white hover:border-[#3874BC]/40"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-[#3874BC] text-white">
                        <Star size={11} /> Pro
                      </span>
                      {selectedPlan === "pro" && (
                        <span className="text-[#3874BC]">
                          <CheckCircle2 size={20} />
                        </span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-0.5">Pro</p>
                    <p className="text-sm text-gray-400 mb-4">Rp 100.000 <span className="text-xs">/ 30 Hari</span></p>
                    <p className="text-xs text-gray-500 mb-5">Untuk bisnis yang berkembang dengan kebutuhan lebih dari satu outlet.</p>
                    <ul className="space-y-2">
                      {["3 Outlet", "20 Pengguna", "Laporan real-time", "Stock opname", "Multi-kasir"].map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 size={14} className="text-[#3874BC] flex-shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 — Buat Akun Owner */}
            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Buat Akun Owner</h2>
                <p className="text-gray-500 text-sm mb-8">Lengkapi data dirimu untuk membuat akun.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                    <input type="text" placeholder="Nama Lengkap" className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input type="email" placeholder="nama@email.com" className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Username</label>
                    <input type="text" placeholder="username" className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Nomor Telepon</label>
                    <input type="tel" placeholder="+62 8xx xxxx xxxx" className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} placeholder="Minimal 8 karakter" className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 pr-11 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Konfirmasi Password</label>
                    <div className="relative">
                      <input type={showConfirm ? "text" : "password"} placeholder="Ulangi password" className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 pr-11 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 — Lengkapi Data Perusahaan */}
            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Lengkapi Data Perusahaan</h2>
                <p className="text-gray-500 text-sm mb-8">Informasi ini akan digunakan untuk profil bisnis kamu.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Nama Perusahaan</label>
                    <input type="text" placeholder="PT / CV / Nama Usaha" className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Telepon Perusahaan</label>
                    <input type="tel" placeholder="+62 2x xxxx xxxx" className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Alamat</label>
                    <input type="text" placeholder="Jl. Contoh No. 1, Kota, Provinsi" className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Deskripsi Perusahaan</label>
                    <textarea rows={4} placeholder="Ceritakan sedikit tentang bisnis kamu..." className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm resize-none" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 — Pembayaran */}
            {step === 4 && selectedPlan && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                {/* Left — Payment Method */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">Pembayaran</h2>
                  <p className="text-gray-500 text-sm mb-6">Pilih metode pembayaran yang kamu inginkan.</p>

                  {/* Method Toggle */}
                  <div className="flex gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all ${paymentMethod === "card"
                        ? "border-[#ff6b00] bg-[#fff4ec] text-[#ff6b00]"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                        }`}
                    >
                      <CreditCard size={16} /> Kartu
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("gopay")}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all ${paymentMethod === "gopay"
                        ? "border-[#ff6b00] bg-[#fff4ec] text-[#ff6b00]"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                        }`}
                    >
                      <Wallet size={16} /> GoPay
                    </button>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Nomor Kartu</label>
                        <div className="relative">
                          <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 pr-28 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 items-center">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-4 object-contain opacity-70" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MC" className="h-4 object-contain opacity-70" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-gray-700">Tanggal Kedaluwarsa</label>
                          <input type="text" placeholder="MM / YY" className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-gray-700">Kode Keamanan</label>
                          <input type="text" placeholder="CVV" maxLength={4} className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                        </div>
                      </div>
                      <label className="flex items-start gap-2.5 text-xs text-gray-500 cursor-pointer mt-1">
                        <input type="checkbox" className="mt-0.5 accent-[#ff6b00]" />
                        Simpan detail kartu ini untuk pembelian mendatang
                      </label>
                    </div>
                  )}

                  {paymentMethod === "gopay" && (
                    <div className="bg-[#f9fafb] border border-dashed border-[#ff6b00]/40 rounded-2xl p-6 text-center">
                      <Wallet size={36} className="text-[#ff6b00] mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-700 mb-1">Bayar via GoPay</p>
                      <p className="text-xs text-gray-400">Kamu akan diarahkan ke aplikasi Gojek untuk menyelesaikan pembayaran.</p>
                    </div>
                  )}
                </div>

                {/* Right — Plan Summary */}
                <div
                  className="rounded-2xl p-6 border-2"
                  style={{ backgroundColor: planBg, borderColor: planAccent + "40" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full text-white"
                      style={{ backgroundColor: planAccent }}
                    >
                      {isFreePlan ? <Zap size={11} /> : <Star size={11} />}
                      {planName}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{planPeriod}</span>
                  </div>

                  <p className="text-2xl font-bold text-gray-900 mb-1">{planPrice}</p>
                  <p className="text-xs text-gray-500 mb-5">
                    {isFreePlan
                      ? "Cocok untuk kamu yang baru mulai mengelola bisnis F&B pertama."
                      : "Untuk bisnis yang berkembang dengan kebutuhan lebih dari satu outlet."}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {planFeatures.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 size={14} style={{ color: planAccent }} className="flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>

                  <div className="border-t pt-4 space-y-2" style={{ borderColor: planAccent + "30" }}>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Langganan per 30 hari</span>
                      <span>{planPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Estimasi pajak</span>
                      <span>Rp 0</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t" style={{ borderColor: planAccent + "30" }}>
                      <span>Yang harus dibayar hari ini</span>
                      <span style={{ color: planAccent }}>{planPrice}</span>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── Footer Buttons ─────────────────────────────────────────────── */}
          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={handleBack}
              className={`px-6 py-3 rounded-xl font-medium text-sm text-white transition-colors ${step === 1 ? "invisible" : ""}`}
              style={{ backgroundColor: "#1D5E84" }}
            >
              ← Kembali
            </button>

            <button
              onClick={handleNext}
              disabled={step === 1 && !selectedPlan}
              className={`px-10 py-3.5 rounded-xl font-medium text-base transition-colors ${step === 1 && !selectedPlan
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#ff6b00] text-white hover:bg-[#e65a00]"
                }`}
            >
              {step === TOTAL_STEPS ? "Langganan" : "Lanjut →"}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}