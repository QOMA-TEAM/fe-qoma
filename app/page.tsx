import { Navbar } from "@/components/landing-page/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fff4ec] relative overflow-hidden font-sans">
      <Navbar />
      
      {/* Background decorations similar to the form pages */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#ff6b00] rounded-full blur-[2px] opacity-90 z-0"></div>
      
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
          Manage your tenant <br /> with <span className="text-[#ff6b00]">QOMA</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          The all-in-one platform to manage your business features, pricing, and contacts efficiently. 
          Get started today and streamline your workflow.
        </p>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/register" 
            className="px-8 py-4 bg-[#ff6b00] text-white rounded-md font-semibold text-lg hover:bg-[#e65a00] transition-colors shadow-lg shadow-[#ff6b00]/30"
          >
            Start free
          </Link>
          <Link 
            href="/#feature" 
            className="px-8 py-4 bg-white text-gray-800 rounded-md font-semibold text-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Learn more
          </Link>
        </div>
      </main>
    </div>
  );
}
