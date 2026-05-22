"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/axios";

// ── Peta role → route ────────────────────────────────────────────────────────
const ROLE_REDIRECT: Record<string, string> = {
  super_admin: "/superadmin/dashboard",
  owner: "/owner/dashboard",
  kasir: "/kasir/dashboard",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      const data = response.data;

      // ── Ambil token ──────────────────────────────────────────────────────
      const token: string =
        data.access_token ?? data.token ?? data.data?.access_token ?? "";

      if (!token) {
        setError("Token tidak ditemukan pada respons server.");
        return;
      }

      // ── Ambil role ───────────────────────────────────────────────────────
      const role: string =
        data.role ??
        data.user?.role ??
        data.data?.role ??
        data.data?.user?.role ??
        "";

      const destination = ROLE_REDIRECT[role];

      if (!destination) {
        setError(`Role "${role}" tidak dikenali. Hubungi administrator.`);
        return;
      }

      // ── Simpan token & role ke localStorage + cookie (untuk middleware) ──
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      document.cookie = `token=${token}; path=/; SameSite=Lax`;
      document.cookie = `role=${role}; path=/; SameSite=Lax`;

      router.push(destination);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(msg ?? "Email atau password salah.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Kolom Kiri: Branding Oranye */}
      <div className="hidden md:flex flex-col items-center justify-center w-[45%] relative bg-[#FF6600]">
        <div className="absolute inset-y-0 right-0 w-24 pointer-events-none z-0 translate-x-[2px]">
          <svg
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            className="h-full w-full fill-white"
          >
            <path d="M100,0 C-20,300 120,700 100,1000 Z" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col items-center -ml-8">
          <div className="bg-white rounded-[2rem] p-6 shadow-xl mb-8 flex items-center justify-center size-48">
            <Image
              src="/logoqoma.svg"
              alt="QOMA Logo"
              width={140}
              height={140}
              className="object-contain"
            />
          </div>
          <h1 className="text-white text-[32px] font-extrabold text-center leading-tight tracking-wide">
            QOMA - QR ORDER
            <br />
            MANAJEMEN
          </h1>
        </div>
      </div>

      {/* Kolom Kanan: Form Login */}
      <div className="flex flex-col items-center justify-center w-full md:w-[55%] p-8 lg:p-24 bg-white relative z-10">
        <div className="w-full max-w-sm space-y-10">
          <div className="text-center mb-12">
            <h2 className="text-[40px] font-extrabold tracking-tight text-gray-900">
              Welcome Back
            </h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-2.5">
              <Label
                htmlFor="email"
                className="text-[15px] font-bold text-gray-900"
              >
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email"
                required
                className="h-[46px] border-gray-200 bg-gray-50/30 text-gray-800 placeholder:text-gray-400 rounded-xl px-4 text-[15px] focus-visible:ring-1 focus-visible:ring-[#FF6600] focus-visible:border-[#FF6600]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2.5 pt-2">
              <Label
                htmlFor="password"
                className="text-[15px] font-bold text-gray-900"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                required
                className="h-[46px] border-gray-200 bg-gray-50/30 text-gray-800 placeholder:text-gray-400 rounded-xl px-4 text-[15px] focus-visible:ring-1 focus-visible:ring-[#FF6600] focus-visible:border-[#FF6600]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="pt-8 flex justify-center">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-36 h-[46px] bg-[#3B82F6] hover:bg-blue-600 text-white rounded-[14px] font-semibold text-[17px] shadow-sm transition-all active:scale-95"
              >
                {isLoading ? "Loading..." : "Login"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
