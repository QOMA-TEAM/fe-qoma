import { Navbar } from "@/components/landing-page/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fff4ec] font-sans relative overflow-x-hidden">
      <Navbar />
      
      {/* Background decorations */}
      <div className="absolute top-[-5%] right-[-10%] w-[800px] h-[800px] bg-[#ff6b00] rounded-[100px] rotate-45 blur-[4px] z-0 opacity-90 hidden md:block" style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#ff6b00]/10 to-transparent z-0"></div>

      <main className="relative z-10 w-full pt-32 flex flex-col items-center">
        
        {/* --- Hero Section --- */}
        <section id="home" className="w-full max-w-6xl mx-auto px-6 flex flex-col items-center text-center pb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight max-w-4xl tracking-tight">
            Kelola Seluruh Cabang <span className="text-[#2563eb]">F&B</span> Anda <br className="hidden md:block" /> dalam Satu Platform Cerdas
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-16 max-w-3xl font-medium">
            SaaS komprehensif untuk memantau operasional, <br className="hidden md:block" />
            menyinkronkan data antar outlet, dan mengendalikan inventaris bahan baku secara real-time.
          </p>
          
          {/* Dashboard Image */}
          <div className="w-full max-w-5xl relative rounded-2xl overflow-hidden shadow-2xl border-[6px] border-[#2563eb]/20 bg-white z-20 transform hover:scale-[1.01] transition-transform duration-500">
            <Image 
              src="/fotodashboard.svg" 
              alt="Dashboard Preview" 
              width={1200} 
              height={700} 
              className="w-full h-auto object-cover"
              priority
            />
          </div>
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
                  <span>1.</span> Manajemen Multi-Outlet
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Pantau performa, atur menu, dan kelola akses karyawan untuk ribuan outlet berbeda hanya dari satu dashboard utama.
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
            </div>
          </div>
        </section>

        {/* --- Pricing Section --- */}
        <section id="pricing" className="w-full bg-white py-24 border-t border-gray-100">
          <div className="w-full max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Pricing</h2>
              <p className="text-gray-500 text-lg">Using basic skills you can improve your business stuff with<br/>Around</p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="bg-[#fff4ec] rounded-3xl p-10 w-full md:w-1/2 border-2 border-[#ff6b00] shadow-lg relative transform hover:-translate-y-1 transition-transform">
                <h3 className="text-2xl font-bold text-gray-900">Free</h3>
                <p className="text-sm text-gray-500 mb-6">Plan</p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-bold text-gray-900">Rp. 0</span>
                </div>
                <p className="text-gray-500 text-sm mb-8">Per 30 Hari</p>
                
                <div className="w-full h-px bg-gray-300 mb-8"></div>
                
                <ul className="mb-10 space-y-4 text-gray-600">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    1 Outlet
                  </li>
                </ul>
                
                <Link href="/register" className="block w-full py-3.5 px-4 bg-[#ff6b00] hover:bg-[#e65a00] text-white text-center font-semibold rounded-xl transition-colors">
                  Get Start
                </Link>
              </div>
              
              {/* Pro Plan */}
              <div className="bg-[#eef2f6] rounded-3xl p-10 w-full md:w-1/2 border border-gray-200 shadow-md relative transform hover:-translate-y-1 transition-transform">
                <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
                <p className="text-sm text-gray-500 mb-6">Plan</p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-bold text-gray-900">Rp. 100.000</span>
                </div>
                <p className="text-gray-500 text-sm mb-8">Per 30 Hari</p>
                
                <div className="w-full h-px bg-gray-300 mb-8"></div>
                
                <ul className="mb-10 space-y-4 text-gray-600">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                    3 Outlet
                  </li>
                </ul>
                
                <Link href="/register" className="block w-full py-3.5 px-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-center font-semibold rounded-xl transition-colors">
                  Get Start
                </Link>
              </div>
            </div>
          </div>
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
