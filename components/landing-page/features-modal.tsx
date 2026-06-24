'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface FeatureBlock {
    id: string
    eyebrow: string
    headline: string
    body: string
    image: string
    imageAlt: string
    imagePos: 'left' | 'right'
    accent: string
    bgTint: string
    pills: string[]
}

/* ─────────────────────────────────────────────
   Data — sesuaikan path image setelah copy ke /public/features/
───────────────────────────────────────────── */
const features: FeatureBlock[] = [
    {
        id: 'owner-dashboard',
        eyebrow: 'Owner · Multi-Outlet',
        headline: 'Pantau semua cabang dari satu layar',
        body:
            'Dashboard owner menampilkan performa setiap outlet secara real-time — profit, jumlah transaksi, kerugian, dan notifikasi stok rendah. Tidak perlu tanya kasir satu per satu.',
        image: '/features/owner-dashboard.png',   // → screenshot 2.png
        imageAlt: 'Dashboard owner multi-outlet dengan ringkasan profit dan transaksi',
        imagePos: 'right',
        accent: '#FB6300',
        bgTint: '#FCFEF1',
        pills: ['Profit & Loss real-time', 'Notifikasi stok otomatis', 'Analitik pelanggan', 'Multi-outlet'],
    },
    {
        id: 'detail-keuangan',
        eyebrow: 'Keuangan · Laporan',
        headline: 'Riwayat transaksi yang tidak menyembunyikan apa-apa',
        body:
            'Setiap pengeluaran restock, setiap pendapatan pesanan, tercatat lengkap dengan timestamp dan ID unik. Filter berdasarkan tipe dan rentang waktu, ekspor kapan saja.',
        image: '/features/detail-keuangan.png',   // → screenshot 5.png
        imageAlt: 'Halaman detail keuangan dengan tabel riwayat transaksi',
        imagePos: 'left',
        accent: '#1D5E84',
        bgTint: '#F0F6FA',
        pills: ['Total pendapatan & pengeluaran', 'Filter 7 / 30 hari', 'Paginasi transaksi', 'Alert kerugian otomatis'],
    },
    {
        id: 'restock',
        eyebrow: 'Inventaris · Bahan Baku',
        headline: 'Restock bahan baku dalam hitungan detik',
        body:
            'Pilih bahan dari grid visual bergambar, isi jumlah dan tanggal kadaluarsa, catat pengeluaran — selesai. Sistem langsung memperbarui stok dan mencatat di laporan keuangan.',
        image: '/features/restock-bahan.png',     // → screenshot 3.png
        imageAlt: 'Modal restock bahan baku dengan grid pilih item bergambar',
        imagePos: 'right',
        accent: '#FB6300',
        bgTint: '#FCFEF1',
        pills: ['Pilih item via visual grid', 'Catat tanggal kadaluarsa', 'Otomatis update stok', 'Terintegrasi laporan'],
    },
    {
        id: 'stock-opname',
        eyebrow: 'Stock Opname · Audit',
        headline: 'Audit stok dengan bukti foto langsung',
        body:
            'Kasir bisa tambah draft penyesuaian stok — catat bahan rusak, jumlah yang hilang, lengkap dengan foto bukti. Owner tinggal review dan approve dari dashboard.',
        image: '/features/stock-opname.png',      // → screenshot 44.png
        imageAlt: 'Form tambah draft stock opname dengan upload foto bukti',
        imagePos: 'left',
        accent: '#1D5E84',
        bgTint: '#F0F6FA',
        pills: ['Draft → Review → Approved', 'Upload foto bukti', 'Tipe: Rusak / Hilang / Lebih', 'Blokir edit setelah approved'],
    },
]

/* ─────────────────────────────────────────────
   Pill badge
───────────────────────────────────────────── */
function Pill({ label, accent }: { label: string; accent: string }) {
    return (
        <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
                background: `${accent}12`,
                color: accent,
                border: `1px solid ${accent}25`,
            }}
        >
            <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: accent }}
            />
            {label}
        </span>
    )
}

/* ─────────────────────────────────────────────
   Single feature row with scroll-reveal
───────────────────────────────────────────── */
function FeatureRow({ block }: { block: FeatureBlock }) {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true) },
            { threshold: 0.15 },
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    const isLeft = block.imagePos === 'left'

    return (
        <div
            style={{ background: block.bgTint }}
            className="w-full py-20 md:py-28 relative overflow-hidden"
        >
            {/* Dot grid texture */}
            <svg
                aria-hidden
                className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.04]"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <pattern
                        id={`dots-${block.id}`}
                        x="0" y="0" width="28" height="28"
                        patternUnits="userSpaceOnUse"
                    >
                        <circle cx="2" cy="2" r="1.8" fill={block.accent} />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#dots-${block.id})`} />
            </svg>

            {/* Ghost letter bg */}
            <span
                aria-hidden
                className="pointer-events-none select-none absolute -bottom-4 font-black opacity-[0.04] text-[220px] leading-none"
                style={{
                    color: block.accent,
                    right: isLeft ? 'auto' : '-0.02em',
                    left: isLeft ? '-0.02em' : 'auto',
                }}
            >
                {block.id === 'owner-dashboard' ? 'O'
                    : block.id === 'detail-keuangan' ? 'K'
                        : block.id === 'restock' ? 'R'
                            : 'S'}
            </span>

            <div
                ref={ref}
                className={cn(
                    'relative z-10 w-full max-w-6xl mx-auto px-6',
                    'grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center',
                    !isLeft && 'lg:[direction:rtl]',
                )}
            >
                {/* ── Image side ── */}
                <div
                    className={cn(
                        '[direction:ltr] transition-all duration-700 ease-out',
                        visible
                            ? 'opacity-100 translate-x-0'
                            : isLeft
                                ? 'opacity-0 -translate-x-14'
                                : 'opacity-0 translate-x-14',
                    )}
                >
                    {/* Tablet frame */}
                    <div
                        className="relative rounded-[28px] p-[10px] ring-1 ring-black/20"
                        style={{
                            background: '#1c1c1e',
                            boxShadow: `0 32px 64px -12px ${block.accent}30, 0 0 0 1px rgba(0,0,0,0.12)`,
                        }}
                    >
                        {/* Camera notch */}
                        <div className="absolute top-[13px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-[#2c2c2e] ring-1 ring-black/40 z-10" />
                        {/* Screen */}
                        <div className="relative w-full overflow-hidden rounded-[20px] bg-white aspect-[4/3]">
                            <Image
                                src={block.image}
                                alt={block.imageAlt}
                                fill
                                className="object-cover object-top"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                        {/* Home bar */}
                        <div className="flex justify-center mt-2">
                            <div className="w-12 h-[3px] rounded-full bg-white/15" />
                        </div>
                    </div>

                    {/* Floating badge below frame */}
                    <div
                        className={cn(
                            'mt-5 inline-flex items-center gap-3 pl-3 pr-5 py-2.5 rounded-2xl bg-white',
                            'ring-1 ring-black/[0.06]',
                            isLeft ? 'ml-0' : 'ml-auto mr-0 float-right',
                        )}
                        style={{ boxShadow: `0 8px 24px -6px ${block.accent}20` }}
                    >
                        <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-base font-bold flex-shrink-0"
                            style={{ background: block.accent }}
                        >
                            ✓
                        </div>
                        <div>
                            <p className="text-[12px] font-bold text-[#26180B] leading-none mb-0.5">{block.eyebrow.split(' · ')[0]}</p>
                            <p className="text-[11px] text-gray-400 leading-none">Sync otomatis · No reload</p>
                        </div>
                    </div>
                </div>

                {/* ── Copy side ── */}
                <div
                    className={cn(
                        '[direction:ltr] transition-all duration-700 delay-[160ms] ease-out',
                        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
                    )}
                >
                    {/* Eyebrow line + label */}
                    <div className="flex items-center gap-3 mb-5">
                        <div
                            className="w-8 h-[2.5px] rounded-full flex-shrink-0"
                            style={{ background: block.accent }}
                        />
                        <span
                            className="text-[11px] font-bold tracking-[0.16em] uppercase"
                            style={{ color: block.accent }}
                        >
                            {block.eyebrow}
                        </span>
                    </div>

                    {/* Headline */}
                    <h3 className="text-3xl md:text-[2.6rem] font-extrabold text-[#26180B] leading-[1.15] mb-6">
                        {block.headline}
                    </h3>

                    {/* Body */}
                    <p className="text-gray-500 text-[1.0625rem] leading-[1.75] mb-9">
                        {block.body}
                    </p>

                    {/* Pills */}
                    <div className="flex flex-wrap gap-2">
                        {block.pills.map((p) => (
                            <Pill key={p} label={p} accent={block.accent} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

/* ─────────────────────────────────────────────
   Section header — dark branded intro
───────────────────────────────────────────── */
function SectionHeader() {
    const ref = useRef<HTMLDivElement>(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true) },
            { threshold: 0.25 },
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    return (
        <div
            ref={ref}
            className="w-full py-24 md:py-32 relative overflow-hidden"
            style={{ background: '#26180B' }}
        >
            {/* Concentric rings */}
            {[280, 480, 680, 900].map((size, i) => (
                <div
                    key={size}
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                    style={{
                        width: size,
                        height: size,
                        borderColor: i % 2 === 0 ? '#FB630016' : '#1D5E8410',
                    }}
                />
            ))}

            {/* Orange glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-10 blur-3xl"
                style={{ background: '#FB6300' }}
            />

            <div
                className={cn(
                    'relative z-10 max-w-6xl mx-auto px-6 text-center',
                    'transition-all duration-700',
                    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
                )}
            >
                {/* Eyebrow pill */}
                <div
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-[0.14em] uppercase mb-8"
                    style={{ background: '#FB630018', color: '#FB6300', border: '1px solid #FB630030' }}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FB6300] animate-pulse" />
                    Platform Features
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-white leading-[1.15] mb-6">
                    Satu platform,
                    <br />
                    <span style={{ color: '#FB6300' }}>semua yang kamu butuhkan</span>
                </h2>

                <p className="text-white/45 text-lg max-w-lg mx-auto leading-relaxed">
                    Dirancang khusus per role — kasir, owner, hingga super admin — agar setiap pengguna punya alur kerja yang intuitif.
                </p>

                {/* Scroll cue */}
                <div className="mt-14 flex flex-col items-center gap-2">
                    <span className="text-white/25 text-xs font-medium tracking-widest uppercase">Jelajahi fitur</span>
                    <div className="relative w-px h-10">
                        <div className="absolute inset-0 bg-white/15" />
                        <div
                            className="absolute top-0 left-0 right-0 bg-[#FB6300]"
                            style={{
                                height: '40%',
                                animation: 'scrollCue 1.8s ease-in-out infinite',
                            }}
                        />
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes scrollCue {
          0%   { transform: translateY(0);   opacity: 1; }
          100% { transform: translateY(250%); opacity: 0; }
        }
      `}</style>
        </div>
    )
}

/* ─────────────────────────────────────────────
   Wave divider between sections
───────────────────────────────────────────── */
function WaveDivider({ fromColor, toColor, accent }: { fromColor: string; toColor: string; accent: string }) {
    return (
        <div aria-hidden className="w-full -my-px overflow-hidden leading-[0]" style={{ background: fromColor }}>
            <svg
                viewBox="0 0 1200 48"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
                className="w-full h-12"
                style={{ display: 'block' }}
            >
                <path
                    d="M0,24 C200,48 400,0 600,24 C800,48 1000,0 1200,24 L1200,48 L0,48 Z"
                    fill={toColor}
                />
                <path
                    d="M0,24 C200,48 400,0 600,24 C800,48 1000,0 1200,24"
                    fill="none"
                    stroke={accent}
                    strokeWidth="1"
                    strokeOpacity="0.2"
                />
            </svg>
        </div>
    )
}

/* ─────────────────────────────────────────────
   Main export
───────────────────────────────────────────── */
export default function FeaturesSection() {
    return (
        <section id="feature" className="w-full">
            <SectionHeader />

            {features.map((block, i) => {
                const next = features[i + 1]
                return (
                    <div key={block.id}>
                        <FeatureRow block={block} />
                        {next && (
                            <WaveDivider
                                fromColor={block.bgTint}
                                toColor={next.bgTint}
                                accent={next.accent}
                            />
                        )}
                    </div>
                )
            })}
        </section>
    )
}