"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/landing-page/Navbar";
import { useRouter } from "next/navigation";
import { CheckCircle2, Zap, Star, CreditCard, Wallet, Eye, EyeOff, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { PlanCard } from '@/components/ui/plan-card'
import { landingService, type PlanFromBE } from '@/services/public/landing'
import { authService } from '@/services/auth'
import { motion } from "framer-motion";

import { AnimatedBackground } from "@/components/animated-background";
import React from "react";


export function MultiStepForm() {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<PlanFromBE | null>(null);
  const [groupedPlans, setGroupedPlans] = useState<Record<string, PlanFromBE[]>>({});
  const [selectedDurations, setSelectedDurations] = useState<Record<string, string>>({});
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"transfer" | "qris">("transfer");
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  // Form States
  const [formData, setFormData] = useState({
    ownerName: "",
    ownerEmail: "",
    ownerUsername: "",
    ownerPhone: "",
    ownerPassword: "",
    ownerConfirmPassword: "",
    companyName: "",
    companyPhone: "",
    companyAddress: "",
    companyDescription: ""
  });

  useEffect(() => {
    landingService.getPlans()
      .then(data => {
        const activePlans = data.filter(p => p.status);
        const groups = activePlans.reduce((acc, plan) => {
          const name = plan.nama_plan.trim();
          if (!acc[name]) acc[name] = [];
          acc[name].push(plan);
          return acc;
        }, {} as Record<string, PlanFromBE[]>);

        const defaults: Record<string, string> = {};
        Object.entries(groups).forEach(([name, plansGroup]) => {
          plansGroup.sort((a, b) => a.durasi_hari - b.durasi_hari);
          defaults[name] = plansGroup[0].id;
        });

        setSelectedDurations(defaults);
        setGroupedPlans(groups);
      })
      .catch(err => {
        console.error("Gagal memuat paket", err);
        toast.error("Gagal memuat paket");
      })
      .finally(() => setIsLoadingPlans(false));
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const router = useRouter();

  const isFreePlan = Number(selectedPlan?.harga) === 0;
  const TOTAL_STEPS = isFreePlan ? 3 : 4;

  const allStepLabels = ["Pilih Paket", "Buat Akun", "Data Perusahaan", "Pembayaran"];
  const stepLabels = isFreePlan
    ? ["Pilih Paket", "Buat Akun", "Data Perusahaan"]
    : allStepLabels;

  // Real-time username validation
  useEffect(() => {
    const username = formData.ownerUsername;
    if (!username) {
      setUsernameError("");
      return;
    }

    if (username.length < 4) {
      setUsernameError("Username harus memiliki minimal 4 karakter");
      return;
    }

    let isMounted = true;

    const check = async () => {
      try {
        const isAvailable = await authService.checkUsername(username);
        if (isMounted) {
          if (!isAvailable) {
            setUsernameError("Username sudah digunakan");
          } else {
            setUsernameError("");
          }
        }
      } catch (err) {
        console.error("Failed to check username", err);
      }
    };

    check();

    return () => {
      isMounted = false;
    };
  }, [formData.ownerUsername]);

  const isStep2Valid = !!(
    formData.ownerName &&
    formData.ownerEmail &&
    formData.ownerUsername &&
    formData.ownerPhone &&
    formData.ownerPassword &&
    formData.ownerConfirmPassword &&
    formData.ownerPassword === formData.ownerConfirmPassword &&
    !usernameError
  );
  const isStep3Valid = !!(formData.companyName && formData.companyPhone && formData.companyAddress && formData.companyDescription);

  let isNextDisabled = false;
  if (step === 1) isNextDisabled = !selectedPlan;
  if (step === 2) isNextDisabled = !isStep2Valid;
  if (step === 3) isNextDisabled = !isStep3Valid;
  if (step === 4 && !isFreePlan) {
    if (paymentMethod === "transfer") {
      isNextDisabled = !paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv;
    }
  }

  const handleNext = async () => {
    if (isNextDisabled || isSubmitting) return;

    // Validate Step 2: Username error check
    if (step === 2 && usernameError) {
      return;
    }

    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        await authService.register({
          nama_owner: formData.ownerName,
          email: formData.ownerEmail,
          username: formData.ownerUsername,
          no_telp: formData.ownerPhone,
          password: formData.ownerPassword,
          password_confirmation: formData.ownerConfirmPassword,
          nama_usaha: formData.companyName,
          telp_usaha: formData.companyPhone,
          alamat: formData.companyAddress,
          deskripsi_usaha: formData.companyDescription,
          plan_id: selectedPlan!.id,
          metode_pembayaran: isFreePlan ? undefined : paymentMethod,
        });
        toast.success("Pendaftaran berhasil! Menunggu konfirmasi superadmin.");
        router.push("/");
      } catch (err: any) {
        toast.error(err.message || "Pendaftaran gagal. Silakan coba lagi.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // ── Plan card colours ─────────────────────────────────────────────────────
  const planAccent = isFreePlan ? "#ff6b00" : "#3874BC";
  const planBg = isFreePlan ? "#fff4ec" : "#dde8f7";
  const planName = selectedPlan?.nama_plan || (isFreePlan ? "Free" : "Pro");
  const planPrice = `Rp ${Number(selectedPlan?.harga || 0).toLocaleString('id-ID')}`;
  const planPeriod = selectedPlan?.is_lifetime ? "Lifetime" : `/ ${selectedPlan?.durasi_hari || 30} Hari`;
  const planFeatures = selectedPlan
    ? [
      `${selectedPlan.batas_outlet} Outlet`,
      isFreePlan ? "3 Pengguna" : "Pengguna Tak Terbatas",
      isFreePlan ? "Laporan bulanan" : "Laporan real-time",
      isFreePlan ? "Stock dasar" : "Stock opname & Multi-kasir"
    ]
    : [];

  return (
    <div className="min-h-screen bg-[#fff4ec] relative font-sans flex flex-col overflow-x-hidden">
      <Navbar />

      {/* ── Animated Blob Background ─────────────────────────────────────────── */}
      <AnimatedBackground />

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

                <div className="relative w-full max-w-5xl mx-auto">
                  {/* Tombol Kiri */}
                  <button
                    onClick={() => scrollRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 md:-translate-x-8 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-[#ff6b00] hover:scale-105 transition-transform"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 px-2"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {isLoadingPlans ? (
                      <div className="w-full text-center py-10 text-gray-500">Memuat paket...</div>
                    ) : (
                      Object.keys(groupedPlans)
                        .sort((a, b) => groupedPlans[a][0].harga - groupedPlans[b][0].harga)
                        .map((groupName) => {
                          const groupPlans = groupedPlans[groupName];
                          const activePlanId = selectedDurations[groupName];
                          const activePlanInGroup = groupPlans.find(p => p.id === activePlanId) || groupPlans[0];

                          const isFree = Number(activePlanInGroup.harga) === 0;
                          const isSelected = selectedPlan ? groupPlans.some(p => p.id === selectedPlan.id) : false;

                          const Icon = isFree ? Zap : Star;
                          const activeClass = isFree ? "border-[#ff6b00] bg-[#fff4ec] ring-2 ring-[#ff6b00]" : "border-[#3874BC] bg-[#dde8f7] ring-2 ring-[#3874BC]";
                          const iconClass = isFree ? "text-gray-400" : "text-[#3874BC]";
                          const accentColor = isFree ? "#ff6b00" : "#3874BC";

                          const planFeaturesList = [
                            { text: `${activePlanInGroup.batas_outlet} Outlet`, icon: <CheckCircle2 size={14} className={`${iconClass} flex-shrink-0`} /> },
                            { text: isFree ? "3 Pengguna" : "Pengguna Tak Terbatas", icon: <CheckCircle2 size={14} className={`${iconClass} flex-shrink-0`} /> },
                            { text: isFree ? "Laporan bulanan" : "Laporan real-time", icon: <CheckCircle2 size={14} className={`${iconClass} flex-shrink-0`} /> },
                            { text: isFree ? "Stock dasar" : "Stock opname & Multi-kasir", icon: <CheckCircle2 size={14} className={`${iconClass} flex-shrink-0`} /> },
                          ];

                          return (
                            <div
                              key={groupName}
                              onClick={() => {
                                setSelectedPlan(activePlanInGroup);
                                const newTotalSteps = Number(activePlanInGroup.harga) === 0 ? 3 : 4;
                                if (step > newTotalSteps) setStep(3);
                              }}
                              className="snap-center shrink-0 w-[280px] md:w-[300px] cursor-pointer h-full transition-transform hover:-translate-y-1"
                            >
                              <PlanCard
                                name={activePlanInGroup.nama_plan}
                                price={Number(activePlanInGroup.harga)}
                                period={activePlanInGroup.is_lifetime ? undefined : `${activePlanInGroup.durasi_hari} Hari`}
                                description={activePlanInGroup.deskripsi || (isFree ? "Cocok untuk kamu yang baru mulai mengelola bisnis F&B pertama." : "Untuk bisnis yang berkembang dengan kebutuhan lebih dari satu outlet.")}
                                features={planFeaturesList}
                                headerBadge={
                                  <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${isFree ? "bg-gray-100 text-gray-500 border border-gray-200" : "bg-[#3874BC] text-white"}`}>
                                      <Icon size={11} /> {groupName}
                                    </span>
                                    {isSelected && <span className={isFree ? "text-[#ff6b00]" : "text-[#3874BC]"}><CheckCircle2 size={20} /></span>}
                                  </div>
                                }
                                priceSubtext={
                                  <div className="mt-4">
                                    {groupPlans.length > 1 ? (
                                      <div className="flex flex-wrap gap-2">
                                        {groupPlans.map(p => {
                                          const isPSelected = p.id === activePlanInGroup.id;
                                          return (
                                            <button
                                              key={p.id}
                                              type="button"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedDurations(prev => ({ ...prev, [groupName]: p.id }));
                                                if (isSelected) {
                                                  setSelectedPlan(p);
                                                }
                                              }}
                                              className={`px-3 py-1.5 text-[11px] font-semibold rounded-lg border transition-all ${isPSelected ? "text-white shadow-sm" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}
                                              style={isPSelected ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
                                            >
                                              {p.is_lifetime ? 'Lifetime' : `${p.durasi_hari} Hari`}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${isFree ? "text-gray-400 bg-gray-100" : "text-[#3874BC] bg-[#3874BC]/10"}`}>
                                        {isFree ? "3 langkah saja" : "Termasuk langkah pembayaran"}
                                      </span>
                                    )}
                                  </div>
                                }
                                isActive={selectedPlan === null || isSelected}
                                className={isSelected ? activeClass : ""}
                              />
                            </div>
                          )
                        })
                    )}
                  </div>
                  <style jsx>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>

                  {/* Tombol Kanan */}
                  <button
                    onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 md:translate-x-8 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-[#ff6b00] hover:scale-105 transition-transform"
                  >
                    <ChevronRight size={20} />
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
                    <input type="text" value={formData.ownerName} onChange={(e) => setFormData(p => ({ ...p, ownerName: e.target.value }))} placeholder="Nama Lengkap" className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input type="email" value={formData.ownerEmail} onChange={(e) => setFormData(p => ({ ...p, ownerEmail: e.target.value }))} placeholder="nama@email.com" className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Username</label>
                    <input
                      type="text"
                      value={formData.ownerUsername}
                      onChange={(e) => setFormData(p => ({ ...p, ownerUsername: e.target.value }))}
                      placeholder="username"
                      className={`w-full bg-[#f9fafb] border ${usernameError ? 'border-red-500 focus:ring-red-500/50' : 'border-[#d1d5db] focus:ring-[#ff6b00]/50'} rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 text-sm`}
                    />
                    {usernameError && <span className="text-xs text-red-500">{usernameError}</span>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Nomor Telepon</label>
                    <input type="tel" value={formData.ownerPhone} onChange={(e) => setFormData(p => ({ ...p, ownerPhone: e.target.value }))} placeholder="+62 8xx xxxx xxxx" className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={formData.ownerPassword} onChange={(e) => setFormData(p => ({ ...p, ownerPassword: e.target.value }))} placeholder="Minimal 8 karakter" className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 pr-11 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Konfirmasi Password</label>
                    <div className="relative">
                      <input type={showConfirm ? "text" : "password"} value={formData.ownerConfirmPassword} onChange={(e) => setFormData(p => ({ ...p, ownerConfirmPassword: e.target.value }))} placeholder="Ulangi password" className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 pr-11 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
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
                    <input type="text" value={formData.companyName} onChange={(e) => setFormData(p => ({ ...p, companyName: e.target.value }))} placeholder="PT / CV / Nama Usaha" className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Telepon Perusahaan</label>
                    <input type="tel" value={formData.companyPhone} onChange={(e) => setFormData(p => ({ ...p, companyPhone: e.target.value }))} placeholder="+62 2x xxxx xxxx" className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Alamat</label>
                    <input type="text" value={formData.companyAddress} onChange={(e) => setFormData(p => ({ ...p, companyAddress: e.target.value }))} placeholder="Jl. Contoh No. 1, Kota, Provinsi" className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Deskripsi Perusahaan</label>
                    <textarea rows={4} value={formData.companyDescription} onChange={(e) => setFormData(p => ({ ...p, companyDescription: e.target.value }))} placeholder="Ceritakan sedikit tentang bisnis kamu..." className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm resize-none" />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 — Pembayaran (Pro only) */}
            {step === 4 && !isFreePlan && selectedPlan && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                {/* Left — Payment Method */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">Pembayaran</h2>
                  <p className="text-gray-500 text-sm mb-6">Pilih metode pembayaran yang kamu inginkan.</p>

                  <div className="flex gap-3 mb-6">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("transfer")}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all ${paymentMethod === "transfer"
                        ? "border-[#ff6b00] bg-[#fff4ec] text-[#ff6b00]"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                        }`}
                    >
                      <CreditCard size={16} /> Kartu Kredit / Debit
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("qris")}
                      className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all ${paymentMethod === "qris"
                        ? "border-[#ff6b00] bg-[#fff4ec] text-[#ff6b00]"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                        }`}
                    >
                      <Wallet size={16} /> QRIS
                    </button>
                  </div>

                  {paymentMethod === "transfer" && (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">Nomor Kartu</label>
                        <div className="relative">
                          <input type="text" value={paymentData.cardNumber} onChange={(e) => setPaymentData(p => ({ ...p, cardNumber: e.target.value }))} placeholder="1234 5678 9012 3456" maxLength={19} className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 pr-28 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 items-center">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="MC" className="h-4 object-contain opacity-70" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-gray-700">Tanggal Kedaluwarsa</label>
                          <input type="text" value={paymentData.expiryDate} onChange={(e) => setPaymentData(p => ({ ...p, expiryDate: e.target.value }))} placeholder="MM / YY" className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-gray-700">Kode Keamanan</label>
                          <input type="text" value={paymentData.cvv} onChange={(e) => setPaymentData(p => ({ ...p, cvv: e.target.value }))} placeholder="CVV" maxLength={4} className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50 text-sm" />
                        </div>
                      </div>
                      <label className="flex items-start gap-2.5 text-xs text-gray-500 cursor-pointer mt-1">
                        <input type="checkbox" className="mt-0.5 accent-[#ff6b00]" />
                        Simpan detail kartu ini untuk pembelian mendatang
                      </label>
                    </div>
                  )}

                  {paymentMethod === "qris" && (
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
                    {selectedPlan?.deskripsi || "Untuk bisnis yang berkembang dengan kebutuhan lebih dari satu outlet."}
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
              disabled={isNextDisabled || isSubmitting}
              className={`px-10 py-3.5 rounded-xl font-medium text-base transition-colors ${(isNextDisabled || isSubmitting)
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-[#ff6b00] text-white hover:bg-[#e65a00]"
                }`}
            >
              {isSubmitting ? "Memproses..." : (step === TOTAL_STEPS ? (isFreePlan ? "Daftar Sekarang" : "Langganan") : "Lanjut →")}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}