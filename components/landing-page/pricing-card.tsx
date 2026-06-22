'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PlanCard } from '@/components/ui/plan-card'
import {
    Zap,
    Star,
    Building2,
    CircleCheck,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
} from 'lucide-react'
import { landingService, type PlanFromBE } from '@/services/public/landing'

// ─── Types ────────────────────────────────────────────────────────────────────

type PlanVariant = 'free' | 'pro' | 'enterprise'

interface LocalPlan {
    id: string
    name: string
    price: number | React.ReactNode   // pakai number agar PlanCard bisa formatRupiah
    period: string
    description: string
    features: Array<{ text: string; icon?: React.ReactNode }>
    headerBadge?: React.ReactNode
    actionButton?: React.ReactNode
    variant: PlanVariant
    href: string
    cta: string
}

// ─── Variant helpers ──────────────────────────────────────────────────────────

const VARIANT_ORDER: PlanVariant[] = ['free', 'pro', 'enterprise']

const BADGE_ICONS: Record<PlanVariant, React.ComponentType<{ size?: number }>> = {
    free: Zap,
    pro: Star,
    enterprise: Building2,
}

const BADGE_LABELS: Record<PlanVariant, string> = {
    free: 'Starter',
    pro: 'Pro',
    enterprise: 'Enterprise',
}

const CTA_LABELS: Record<PlanVariant, string> = {
    free: 'Mulai gratis',
    pro: 'Upgrade ke Pro',
    enterprise: 'Hubungi kami',
}

const CTA_HREF: Record<PlanVariant, string> = {
    free: '/register',
    pro: '/register',
    enterprise: '/contact',
}

const BADGE_COLORS: Record<PlanVariant, string> = {
    free: 'bg-[#FB6300]/10 text-[#FB6300] border-0',
    pro: 'bg-[#1D5E84]/10 text-[#1D5E84] border-0',
    enterprise: 'bg-[#26180B]/10 text-[#26180B] border-0',
}

function detectVariant(nama: string, idx: number): PlanVariant {
    const lower = nama.toLowerCase()
    if (lower.includes('enterprise') || lower.includes('custom')) return 'enterprise'
    if (lower.includes('pro') || lower.includes('premium')) return 'pro'
    if (lower.includes('free') || lower.includes('gratis') || lower.includes('basic')) return 'free'
    return VARIANT_ORDER[idx % 3]
}

function buildHeaderBadge(variant: PlanVariant) {
    const Icon = BADGE_ICONS[variant]
    return (
        <Badge className={cn('gap-1.5 text-[11px] font-medium rounded-full px-3 py-1', BADGE_COLORS[variant])}>
            <Icon size={11} />
            {BADGE_LABELS[variant]}
        </Badge>
    )
}

function buildFeatures(plan: PlanFromBE): Array<{ text: string; icon: React.ReactNode }> {
    const feats: Array<{ text: string; icon: React.ReactNode }> = []
    const icon = <CircleCheck size={14} className="text-[#FB6300]" />

    if (plan.batas_outlet === 0) {
        feats.push({ text: 'Outlet tak terbatas', icon })
    } else {
        feats.push({ text: `${plan.batas_outlet} Outlet`, icon })
    }

    if (plan.durasi_hari > 0 && !plan.is_lifetime) {
        feats.push({ text: `${plan.durasi_hari} hari akses`, icon })
    } else if (plan.is_lifetime) {
        feats.push({ text: 'Akses selamanya', icon })
    }

    if (plan.deskripsi) {
        feats.push({ text: plan.deskripsi, icon })
    }

    return feats
}

function mapBEPlanToLocal(plan: PlanFromBE, idx: number): LocalPlan {
    const variant = detectVariant(plan.nama_plan, idx)
    const cta = CTA_LABELS[variant]
    const href = CTA_HREF[variant]

    return {
        id: plan.id,
        name: plan.nama_plan,
        price: plan.harga,   // number → PlanCard akan formatRupiah otomatis
        period: plan.is_lifetime ? 'selamanya' : `${plan.durasi_hari} hari`,
        description: plan.deskripsi ?? '',
        features: buildFeatures(plan),
        headerBadge: buildHeaderBadge(variant),
        actionButton: (
            <Link href={href}>
                <Button className={cn(
                    'w-full rounded-xl text-sm font-medium h-10 border-0',
                    variant === 'pro'
                        ? 'bg-[#1D5E84] hover:bg-[#174d6e] text-white'
                        : variant === 'enterprise'
                            ? 'bg-[#FB6300] hover:bg-[#e05700] text-white'
                            : 'bg-[#FB6300] hover:bg-[#e05700] text-white'
                )}>
                    {cta}
                </Button>
            </Link>
        ),
        variant,
        href,
        cta,
    }
}

// ─── Static fallback data ─────────────────────────────────────────────────────

const STATIC_PLANS: LocalPlan[] = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        period: '30 hari',
        description: 'Baru mulai? Kelola outlet pertamamu tanpa biaya apapun.',
        features: [
            { text: '1 Outlet', icon: <CircleCheck size={14} className="text-[#FB6300]" /> },
            { text: '3 Pengguna', icon: <CircleCheck size={14} className="text-[#FB6300]" /> },
            { text: 'Laporan bulanan', icon: <CircleCheck size={14} className="text-[#FB6300]" /> },
            { text: 'Stock dasar', icon: <CircleCheck size={14} className="text-[#FB6300]" /> },
        ],
        headerBadge: buildHeaderBadge('free'),
        actionButton: (
            <Link href="/register">
                <Button className="w-full rounded-xl text-sm font-medium h-10 border-0 bg-[#FB6300] hover:bg-[#e05700] text-white">
                    Mulai gratis
                </Button>
            </Link>
        ),
        variant: 'free',
        href: '/register',
        cta: 'Mulai gratis',
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 100000,
        period: '30 hari',
        description: 'Untuk bisnis berkembang dengan banyak outlet dan tim yang besar.',
        features: [
            { text: '3 Outlet', icon: <CircleCheck size={14} className="text-[#FB6300]" /> },
            { text: '20 Pengguna', icon: <CircleCheck size={14} className="text-[#FB6300]" /> },
            { text: 'Laporan real-time', icon: <CircleCheck size={14} className="text-[#FB6300]" /> },
            { text: 'Stock opname', icon: <CircleCheck size={14} className="text-[#FB6300]" /> },
            { text: 'Multi-kasir', icon: <CircleCheck size={14} className="text-[#FB6300]" /> },
        ],
        headerBadge: buildHeaderBadge('pro'),
        actionButton: (
            <Link href="/register">
                <Button className="w-full rounded-xl text-sm font-medium h-10 border-0 bg-[#1D5E84] hover:bg-[#174d6e] text-white">
                    Upgrade ke Pro
                </Button>
            </Link>
        ),
        variant: 'pro',
        href: '/register',
        cta: 'Upgrade ke Pro',
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: <span className="text-4xl font-bold text-gray-900">Custom</span>,
        period: 'sesuai kebutuhan',
        description: 'Skalakan bisnis franchise dan chain resto besar kamu tanpa batas.',
        features: [
            { text: 'Outlet tak terbatas', icon: <CircleCheck size={14} className="text-[#FB6300]" /> },
            { text: 'Pengguna tak terbatas', icon: <CircleCheck size={14} className="text-[#FB6300]" /> },
            { text: 'Dashboard pusat', icon: <CircleCheck size={14} className="text-[#FB6300]" /> },
            { text: 'Integrasi API', icon: <CircleCheck size={14} className="text-[#FB6300]" /> },
            { text: 'Dedicated support', icon: <CircleCheck size={14} className="text-[#FB6300]" /> },
        ],
        headerBadge: buildHeaderBadge('enterprise'),
        actionButton: (
            <Link href="/contact">
                <Button className="w-full rounded-xl text-sm font-medium h-10 border-0 bg-[#FB6300] hover:bg-[#e05700] text-white">
                    Hubungi kami
                </Button>
            </Link>
        ),
        variant: 'enterprise',
        href: '/contact',
        cta: 'Hubungi kami',
    },
]

const STATS = [
    { num: '500+', label: 'Bisnis aktif' },
    { num: '30 hr', label: 'Coba gratis' },
]

// ─── Carousel card wrapper (animasi tetap sama) ───────────────────────────────

interface CarouselCardProps {
    plan: LocalPlan
    position: 'prev' | 'cur' | 'next'
    onClick: () => void
}

function CarouselCard({ plan, position, onClick }: CarouselCardProps) {
    const isCurrent = position === 'cur'

    return (
        <div
            onClick={!isCurrent ? onClick : undefined}
            className={cn(
                'absolute w-[230px] transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]',
                position === 'prev' && '-translate-x-[155px] opacity-50 blur-[3px] scale-[.88] z-10 cursor-pointer',
                position === 'cur' && 'translate-x-0 opacity-100 blur-0 scale-100 z-30',
                position === 'next' && 'translate-x-[155px] opacity-50 blur-[3px] scale-[.88] z-10 cursor-pointer',
            )}
        >
            <PlanCard
                name={plan.name}
                price={plan.price}
                period={plan.period}
                description={plan.description}
                features={plan.features}
                headerBadge={plan.headerBadge}
                actionButton={plan.actionButton}
                isActive={isCurrent}
            />
        </div>
    )
}

// ─── PricingSection (main export) ────────────────────────────────────────────

export function PricingSection() {
    const [current, setCurrent] = useState(1)
    const [mounted, setMounted] = useState(false)
    const [plans, setPlans] = useState<LocalPlan[]>(STATIC_PLANS)
    const total = plans.length

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50)
        return () => clearTimeout(t)
    }, [])

    useEffect(() => {
        landingService.getPlans()
            .then((data) => {
                if (data && data.length > 0) {
                    setPlans(data.map(mapBEPlanToLocal))
                }
            })
            .catch(() => {
                // Gagal fetch → tetap pakai STATIC_PLANS
            })
    }, [])

    const prev = (current - 1 + total) % total
    const next = (current + 1) % total

    function getPosition(idx: number): 'prev' | 'cur' | 'next' {
        if (idx === current) return 'cur'
        if (idx === prev) return 'prev'
        return 'next'
    }

    return (
        <section
            id="pricing"
            className="w-full bg-[#FCFEF1] py-20 border-t border-[#1D5E84]/10"
        >
            <div className="w-full max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-0">

                    {/* ── Left column ── */}
                    <div className="flex-1 min-w-0 md:pr-10">
                        <p
                            className={cn(
                                'text-[11px] font-medium tracking-widest uppercase text-[#FB6300] mb-3',
                                'transition-all duration-700',
                                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
                            )}
                            style={{ transitionDelay: '80ms' }}
                        >
                            Pilih paketmu
                        </p>

                        <h2
                            className={cn(
                                'text-4xl md:text-[38px] font-medium leading-tight text-[#1D5E84] mb-4',
                                'transition-all duration-700',
                                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                            )}
                            style={{ transitionDelay: '180ms' }}
                        >
                            Mulai kelola bisnis <br />
                            <span className="text-[#FB6300]">resto mu</span> dari sini
                        </h2>

                        <p
                            className={cn(
                                'text-[15px] text-[#26180B] leading-[1.8] mb-8',
                                'transition-all duration-700',
                                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                            )}
                            style={{ transitionDelay: '300ms' }}
                        >
                            Mulai coba gratis dengan mengelola satu tenant,<br />
                            lalu berkembang sesuai ritme bisnis kamu.
                        </p>

                        {/* Stats */}
                        <div
                            className={cn(
                                'flex gap-4 mb-8',
                                'transition-all duration-700',
                                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                            )}
                            style={{ transitionDelay: '420ms' }}
                        >
                            {STATS.map((s) => (
                                <div
                                    key={s.label}
                                    className="flex-1 bg-white rounded-xl border border-[#1D5E84]/10 px-4 py-3"
                                >
                                    <p className="text-2xl font-medium text-[#1D5E84] mb-0.5">{s.num}</p>
                                    <p className="text-[11px] text-[#26180B]/60">{s.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div
                            className={cn(
                                'transition-all duration-700',
                                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                            )}
                            style={{ transitionDelay: '540ms' }}
                        >
                            <Link href="/register">
                                <Button className="bg-[#FB6300] hover:bg-[#e05700] text-white rounded-xl px-6 h-11 text-sm font-medium border-0 gap-2 transition-transform hover:-translate-y-0.5">
                                    <Zap size={15} />
                                    Mulai gratis sekarang
                                    <ArrowRight size={14} />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* ── Right column — carousel ── */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                        {/* Viewport */}
                        <div className="relative w-[380px] h-[420px] flex items-center justify-center">
                            {/* Prev button */}
                            <button
                                aria-label="Sebelumnya"
                                onClick={() => setCurrent(prev)}
                                className={cn(
                                    'absolute left-1 z-20 w-9 h-9 rounded-full flex items-center justify-center',
                                    'bg-[#1D5E84]/15 hover:bg-[#1D5E84]/28 text-[#1D5E84]',
                                    'transition-all duration-200 hover:scale-105',
                                )}
                            >
                                <ChevronLeft size={18} />
                            </button>

                            {/* Cards */}
                            {plans.map((plan, idx) => (
                                <CarouselCard
                                    key={plan.id}
                                    plan={plan}
                                    position={getPosition(idx)}
                                    onClick={() => setCurrent(idx)}
                                />
                            ))}

                            {/* Next button */}
                            <button
                                aria-label="Berikutnya"
                                onClick={() => setCurrent(next)}
                                className={cn(
                                    'absolute right-1 z-20 w-9 h-9 rounded-full flex items-center justify-center',
                                    'bg-[#1D5E84]/15 hover:bg-[#1D5E84]/28 text-[#1D5E84]',
                                    'transition-all duration-200 hover:scale-105',
                                )}
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        {/* Dots */}
                        <div className="flex gap-2 mt-4">
                            {plans.map((_, idx) => (
                                <button
                                    key={idx}
                                    aria-label={`Kartu ${idx + 1}`}
                                    onClick={() => setCurrent(idx)}
                                    className={cn(
                                        'w-2 h-2 rounded-full border-none transition-all duration-300 cursor-pointer',
                                        idx === current
                                            ? 'bg-[#1D5E84] scale-125'
                                            : 'bg-[#1D5E84]/25 hover:bg-[#1D5E84]/50',
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}