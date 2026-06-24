'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
    QrCode,
    ShoppingCart,
    Sliders,
    CheckCircle2,
    ClipboardList,
    CreditCard,
    Package,
    ScanBarcode,
    LayoutDashboard,
    TrendingUp,
    Utensils,
    Boxes,
    BarChart3,
    CreditCard as CardIcon,
    Users,
    BellRing,
    Activity,
    Globe,
} from 'lucide-react'

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */
interface Feature {
    icon: React.ReactNode
    label: string
}

interface RoleTab {
    key: string
    label: string
    badge: string
    badgeColor: string
    description: string
    image: string        // path relatif dari /public
    imageAlt: string
    accentColor: string  // tailwind bg class for tab active state
    features: Feature[]
}

/* ─────────────────────────────────────────────
   Data
───────────────────────────────────────────── */
const roles: RoleTab[] = [
    {
        key: 'pelanggan',
        label: 'Pelanggan',
        badge: 'Self-Order',
        badgeColor: 'bg-orange-100 text-orange-700',
        description:
            'Pelanggan scan QR → pilih menu → bayar. Tidak perlu install app, tidak perlu login.',
        image: '/features/qr-order.png',   // ganti path sesuai struktur public mu
        imageAlt: 'Self-order via QR Code',
        accentColor: '#FB6300',
        features: [
            { icon: <QrCode size={15} />, label: 'Pemesanan via QR Code' },
            { icon: <Sliders size={15} />, label: 'Melihat kategori menu' },
            { icon: <ShoppingCart size={15} />, label: 'Tambah menu ke keranjang' },
            { icon: <Sliders size={15} />, label: 'Kustomisasi add-on' },
            { icon: <CheckCircle2 size={15} />, label: 'Konfirmasi pesanan tanpa login' },
        ],
    },
    {
        key: 'outlet',
        label: 'Outlet / Kasir',
        badge: 'Operasional',
        badgeColor: 'bg-blue-100 text-blue-700',
        description:
            'Semua yang kasir dan manajer outlet butuhkan — dari terima pesanan sampai laporan harian.',
        image: '/features/stock-opname.png',  // screenshot 44.png → taruh di public/features/
        imageAlt: 'Manajemen Stock Opname',
        accentColor: '#1D5E84',
        features: [
            { icon: <ClipboardList size={15} />, label: 'Manajemen pesanan masuk' },
            { icon: <CreditCard size={15} />, label: 'Konfirmasi pembayaran' },
            { icon: <Package size={15} />, label: 'Monitoring inventaris real-time' },
            { icon: <ScanBarcode size={15} />, label: 'Manajemen stock opname' },
            { icon: <QrCode size={15} />, label: 'Manajemen QR meja' },
            { icon: <TrendingUp size={15} />, label: 'Monitoring pendapatan harian' },
            { icon: <Activity size={15} />, label: 'Activity log transaksi' },
        ],
    },
    {
        key: 'owner',
        label: 'Owner',
        badge: 'Multi-Outlet',
        badgeColor: 'bg-emerald-100 text-emerald-700',
        description:
            'Pantau semua outlet dari satu dashboard. Bandingkan performa, kelola menu, analisis bisnis.',
        image: '/features/owner-dashboard.png',  // screenshot 2.png
        imageAlt: 'Dashboard Owner Multi-Outlet',
        accentColor: '#26180B',
        features: [
            { icon: <Globe size={15} />, label: 'Manajemen multi-outlet' },
            { icon: <Utensils size={15} />, label: 'Manajemen menu & harga' },
            { icon: <Boxes size={15} />, label: 'Manajemen bahan baku' },
            { icon: <LayoutDashboard size={15} />, label: 'Dashboard keuangan terintegrasi' },
            { icon: <CardIcon size={15} />, label: 'Manajemen subscription' },
            { icon: <BarChart3 size={15} />, label: 'Analitik bisnis mendalam' },
        ],
    },
    {
        key: 'superadmin',
        label: 'Super Admin',
        badge: 'SaaS',
        badgeColor: 'bg-purple-100 text-purple-700',
        description:
            'Monitor seluruh ekosistem SaaS — tenant, revenue, notifikasi, dan pertumbuhan platform.',
        image: '/features/detail-keuangan.png',  // screenshot 5.png
        imageAlt: 'Detail Keuangan & MRR',
        accentColor: '#7C3AED',
        features: [
            { icon: <LayoutDashboard size={15} />, label: 'Dashboard monitoring SaaS' },
            { icon: <CardIcon size={15} />, label: 'Manajemen subscription tenant' },
            { icon: <TrendingUp size={15} />, label: 'Analitik MRR & pertumbuhan' },
            { icon: <Users size={15} />, label: 'Manajemen pelanggan' },
            { icon: <BellRing size={15} />, label: 'Manajemen notifikasi platform' },
        ],
    },
]

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export default function FeaturesSection() {
    const [activeKey, setActiveKey] = useState<string>('outlet')
    const [animating, setAnimating] = useState(false)
    const [visibleFeatures, setVisibleFeatures] = useState<boolean[]>([])
    const sectionRef = useRef<HTMLDivElement>(null)
    const [sectionVisible, setSectionVisible] = useState(false)

    const active = roles.find((r) => r.key === activeKey)!

    /* Intersection Observer — trigger entrance animation */
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setSectionVisible(true)
            },
            { threshold: 0.15 },
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    /* Stagger feature list on tab change */
    useEffect(() => {
        setAnimating(true)
        setVisibleFeatures([])
        const timer = setTimeout(() => setAnimating(false), 250)
        return () => clearTimeout(timer)
    }, [activeKey])

    useEffect(() => {
        if (animating) return
        const timers: ReturnType<typeof setTimeout>[] = []
        active.features.forEach((_, i) => {
            timers.push(
                setTimeout(() => {
                    setVisibleFeatures((prev) => {
                        const next = [...prev]
                        next[i] = true
                        return next
                    })
                }, i * 80),
            )
        })
        return () => timers.forEach(clearTimeout)
    }, [animating, active.features])

    const handleTabChange = (key: string) => {
        if (key === activeKey) return
        setActiveKey(key)
    }

    return (
        <section
            id="feature"
            ref={sectionRef}
            className="w-full bg-[#FCFEF1] relative py-24 overflow-hidden"
        >
            {/* ── Decorative blobs ── */}
            <div
                className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-3xl"
                style={{ background: '#FB6300' }}
            />
            <div
                className="pointer-events-none absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full opacity-[0.08] blur-3xl"
                style={{ background: '#1D5E84' }}
            />

            <div className="w-full max-w-6xl mx-auto px-6 relative z-10">

                {/* ── Heading ── */}
                <div
                    className={cn(
                        'text-center mb-14 transition-all duration-700',
                        sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
                    )}
                >
                    <span
                        className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
                        style={{ background: '#FB630015', color: '#FB6300' }}
                    >
                        Platform Features
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#26180B] leading-tight">
                        Satu platform,<br />
                        <span style={{ color: '#FB6300' }}>semua kebutuhan</span> F&B-mu
                    </h2>
                    <p className="mt-4 text-gray-500 max-w-xl mx-auto text-base">
                        Dari pelanggan yang scan QR hingga owner yang pantau MRR — semua terhubung dalam satu ekosistem.
                    </p>
                </div>

                {/* ── Role Tabs ── */}
                <div
                    className={cn(
                        'flex flex-wrap justify-center gap-2 mb-12 transition-all duration-700 delay-150',
                        sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
                    )}
                >
                    {roles.map((role) => {
                        const isActive = role.key === activeKey
                        return (
                            <button
                                key={role.key}
                                onClick={() => handleTabChange(role.key)}
                                className={cn(
                                    'relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border',
                                    isActive
                                        ? 'text-white shadow-lg scale-105'
                                        : 'text-gray-600 bg-white border-gray-200 hover:border-gray-400 hover:scale-102',
                                )}
                                style={
                                    isActive
                                        ? {
                                            backgroundColor: role.accentColor,
                                            borderColor: role.accentColor,
                                            boxShadow: `0 4px 20px ${role.accentColor}40`,
                                        }
                                        : {}
                                }
                            >
                                {role.label}
                                {isActive && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white" />
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* ── Main Card ── */}
                <div
                    className={cn(
                        'grid grid-cols-1 lg:grid-cols-2 gap-8 items-center',
                        'bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100',
                        'transition-all duration-700 delay-200',
                        sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12',
                    )}
                >
                    {/* Left — Screenshot mockup */}
                    <div
                        className={cn(
                            'relative h-72 lg:h-full min-h-[360px] overflow-hidden transition-all duration-300',
                            animating ? 'opacity-0 scale-[0.97]' : 'opacity-100 scale-100',
                        )}
                        style={{ background: `${active.accentColor}08` }}
                    >
                        {/* Decorative top bar */}
                        <div
                            className="absolute top-0 left-0 right-0 h-1 z-20"
                            style={{ background: active.accentColor }}
                        />

                        {/* Laptop frame hint */}
                        <div className="absolute inset-4 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/10">
                            <Image
                                src={active.image}
                                alt={active.imageAlt}
                                fill
                                className="object-cover object-top"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                priority
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </div>

                        {/* Badge overlay */}
                        <div className="absolute bottom-8 left-8 z-10">
                            <span
                                className="px-3 py-1.5 rounded-full text-xs font-bold text-white backdrop-blur-sm"
                                style={{ background: `${active.accentColor}cc` }}
                            >
                                {active.badge}
                            </span>
                        </div>
                    </div>

                    {/* Right — Feature list */}
                    <div
                        className={cn(
                            'p-8 lg:p-10 transition-all duration-300',
                            animating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0',
                        )}
                    >
                        {/* Role badge */}
                        <span
                            className={cn(
                                'inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3',
                                active.badgeColor,
                            )}
                        >
                            {active.badge}
                        </span>

                        <h3 className="text-2xl font-bold text-[#26180B] mb-2">
                            {active.label}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed mb-7">
                            {active.description}
                        </p>

                        {/* Feature pills */}
                        <ul className="space-y-2.5">
                            {active.features.map((feat, i) => (
                                <li
                                    key={feat.label}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium',
                                        'transition-all duration-300',
                                        visibleFeatures[i]
                                            ? 'opacity-100 translate-x-0'
                                            : 'opacity-0 -translate-x-4',
                                    )}
                                    style={{
                                        borderColor: visibleFeatures[i] ? `${active.accentColor}30` : 'transparent',
                                        background: visibleFeatures[i] ? `${active.accentColor}08` : 'transparent',
                                        color: '#26180B',
                                        transitionDelay: `${i * 50}ms`,
                                    }}
                                >
                                    <span
                                        className="flex-shrink-0 p-1.5 rounded-lg text-white"
                                        style={{ background: active.accentColor }}
                                    >
                                        {feat.icon}
                                    </span>
                                    {feat.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ── Bottom stats strip ── */}
                <div
                    className={cn(
                        'mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-700 delay-300',
                        sectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
                    )}
                >
                    {[
                        { value: '4', label: 'Role pengguna', accent: '#FB6300' },
                        { value: '30+', label: 'Fitur terintegrasi', accent: '#1D5E84' },
                        { value: 'Real-time', label: 'Update stok & pesanan', accent: '#26180B' },
                        { value: 'Multi-outlet', label: 'Satu dashboard utama', accent: '#7C3AED' },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white rounded-2xl p-5 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="text-2xl font-bold mb-1" style={{ color: stat.accent }}>
                                {stat.value}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}