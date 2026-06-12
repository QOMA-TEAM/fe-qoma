"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing-page/Navbar";
import { useRouter } from "next/navigation";

export function MultiStepForm() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit form
      alert("Form submitted! Menunggu konfirmasi superadmin.");
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#fff4ec] relative font-sans flex flex-col">
      <Navbar />
      
      {/* Background decorations */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#ff6b00] rounded-full blur-[2px] opacity-90 z-0"></div>
      
      <main className="relative z-10 flex-1 flex items-center justify-center pt-24 pb-12 px-4">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-4xl p-10 md:p-14 min-h-[500px] flex flex-col relative">
          
          {/* Steps Indicator */}
          <div className="flex items-center justify-center mb-8 gap-4">
            {/* Step 1 */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-medium ${step >= 1 ? (step === 1 ? 'bg-[#ff6b00] text-white' : 'bg-[#eef2f6] text-gray-500') : 'bg-[#eef2f6] text-gray-500'}`}>
              1
            </div>
            
            {/* Line 1-2 */}
            <div className="w-24 h-2 rounded-full bg-[#eef2f6] overflow-hidden">
              <div className={`h-full bg-[#ff6b00] transition-all duration-300 ${step > 1 ? 'w-full' : (step === 1 ? 'w-1/3' : 'w-0')}`}></div>
            </div>
            
            {/* Step 2 */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-medium ${step >= 2 ? (step === 2 ? 'bg-[#ff6b00] text-white' : 'bg-[#eef2f6] text-gray-500') : 'bg-[#eef2f6] text-gray-500'}`}>
              2
            </div>
            
            {/* Line 2-3 */}
            <div className="w-24 h-2 rounded-full bg-[#eef2f6] overflow-hidden">
              <div className={`h-full bg-[#ff6b00] transition-all duration-300 ${step > 2 ? 'w-full' : (step === 2 ? 'w-1/3' : 'w-0')}`}></div>
            </div>
            
            {/* Step 3 */}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-medium ${step === 3 ? 'bg-[#ff6b00] text-white' : 'bg-[#eef2f6] text-gray-500'}`}>
              3
            </div>
          </div>
          
          {/* Orange Divider */}
          <div className="h-[3px] w-full bg-[#ff6b00] mb-10 rounded-full"></div>
          
          {/* Form Content */}
          <div className="flex-1">
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-medium text-gray-800">Nama Tenant</label>
                  <input 
                    type="text" 
                    placeholder="Nama Tenant" 
                    className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-medium text-gray-800">Email</label>
                  <input 
                    type="email" 
                    placeholder="Alamat Email" 
                    className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-medium text-gray-800">Alamat Tenant</label>
                  <input 
                    type="text" 
                    placeholder="Alamat Tenant" 
                    className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50"
                  />
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-medium text-gray-800">Nama Owner</label>
                  <input 
                    type="text" 
                    placeholder="Nama Owner" 
                    className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-medium text-gray-800">Password</label>
                  <input 
                    type="password" 
                    placeholder="******" 
                    className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-medium text-gray-800">Username</label>
                  <input 
                    type="text" 
                    placeholder="Username" 
                    className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-medium text-gray-800">Konfirmasi Password</label>
                  <input 
                    type="password" 
                    placeholder="******" 
                    className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50"
                  />
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-lg font-medium text-gray-800">Metode Pembayaran</label>
                  <div className="relative">
                    <select className="w-full bg-[#f9fafb] border border-[#d1d5db] rounded-xl px-4 py-3.5 text-gray-500 appearance-none focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/50">
                      <option value="">Pilih Metode Pembayaran</option>
                      <option value="transfer">Bank Transfer</option>
                      <option value="ewallet">E-Wallet</option>
                      <option value="cc">Credit Card</option>
                    </select>
                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                      <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1.5L6 6.5L11 1.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer / Buttons */}
          <div className="mt-12 flex justify-end">
            <button 
              onClick={handleNext}
              className="px-10 py-3.5 bg-[#ff6b00] text-white rounded-xl font-medium text-lg hover:bg-[#e65a00] transition-colors"
            >
              {step === 3 ? "Submit" : "Continue"}
            </button>
          </div>
          
        </div>
      </main>
    </div>
  );
}
