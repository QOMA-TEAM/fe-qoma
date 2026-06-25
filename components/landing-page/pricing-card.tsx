'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
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

type CardPosition = 'prev' | 'cur' | 'next' | 'hidden-left' | 'hidden-right'

interface LocalPlan {
    id: string
    name: string
    price: number | React.ReactNode
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

    if (plan.is_lifetime) {
        feats.push({ text: 'Akses selamanya', icon })
    } else if (plan.durasi_hari > 0) {
        feats.push({ text: `${plan.durasi_hari} hari akses`, icon })
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
        price: (() => {
            const num = Math.round(Number(plan.harga) || 0)
            return (
                <span className="text-xl font-bold leading-none tracking-tight">
                    {num === 0 ? 'Gratis' : `Rp ${num.toLocaleString('id-ID')}`}
                </span>
            )
        })(),
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
                        : 'bg-[#FB6300] hover:bg-[#e05700] text-white',
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

const STATS = [
    { num: '500+', label: 'Bisnis aktif' },
    { num: '30 hr', label: 'Coba gratis' },
]

// ─── Animation variants ───────────────────────────────────────────────────────

// Staggered fade-up untuk elemen kiri
const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as any, delay },
    }),
}

// Slide dari kiri untuk kolom teks
const slideFromLeft = {
    hidden: { opacity: 0, x: -36 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] as any },
    },
}

// Slide dari kanan untuk kolom carousel
const slideFromRight = {
    hidden: { opacity: 0, x: 36 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] as any, delay: 0.12 },
    },
}

// ─── CarouselCard ─────────────────────────────────────────────────────────────

interface CarouselCardProps {
    plan: LocalPlan
    position: CardPosition
    onClick: () => void
}

function CarouselCard({ plan, position, onClick }: CarouselCardProps) {
    const isCurrent = position === 'cur'

    return (
        <div
            onClick={!isCurrent ? onClick : undefined}
            className={cn(
                'absolute w-[230px] transition-all duration-500 ease-[cubic-bezier(.4,0,.2,1)]',
                position === 'prev' && '-translate-x-[155px] opacity-40 blur-[3px] scale-[.86] z-10 cursor-pointer',
                position === 'cur' && 'translate-x-0 opacity-100 blur-0 scale-100 z-30',
                position === 'next' && 'translate-x-[155px] opacity-40 blur-[3px] scale-[.86] z-10 cursor-pointer',
                position === 'hidden-left' && '-translate-x-[310px] opacity-0 scale-[.7] z-0 pointer-events-none',
                position === 'hidden-right' && 'translate-x-[310px] opacity-0 scale-[.7] z-0 pointer-events-none',
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

// ─── PricingSection ───────────────────────────────────────────────────────────

export function PricingSection() {
    const [current, setCurrent] = useState(0)
    const [plans, setPlans] = useState<LocalPlan[]>([])
    const total = plans.length

    // ── Scroll-triggered animation ──
    const sectionRef = useRef<HTMLElement>(null)
    const isInView = useInView(sectionRef, { once: true, margin: '-80px 0px' })

    useEffect(() => {
        landingService.getPlans()
            .then((data) => {
                if (data && data.length > 0) {
                    const mapped = data.map(mapBEPlanToLocal)
                    setPlans(mapped)
                    const proIdx = mapped.findIndex(p => p.variant === 'pro')
                    setCurrent(proIdx >= 0 ? proIdx : Math.floor(mapped.length / 2))
                }
            })
            .catch(err => console.error('Gagal fetch plans:', err))
    }, [])

    const prevIdx = total > 0 ? (current - 1 + total) % total : 0
    const nextIdx = total > 0 ? (current + 1) % total : 0

    function getPosition(idx: number): CardPosition {
        if (total === 0) return 'cur'
        if (idx === current) return 'cur'
        if (idx === prevIdx) return 'prev'
        if (idx === nextIdx) return 'next'
        const fwd = (idx - current + total) % total
        return fwd <= total / 2 ? 'hidden-right' : 'hidden-left'
    }

    return (
        <section
            ref={sectionRef}
            id="pricing"
            className="w-full bg-white py-20 border-t border-gray-100"
        >
            <div className="w-full max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-0">

                    {/* ── Left column ── */}
                    <motion.div
                        className="flex-1 min-w-0 md:pr-10"
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        variants={slideFromLeft}
                    >
                        {/* Eyebrow */}
                        <motion.p
                            custom={0}
                            variants={fadeUp}
                            className="text-[11px] font-medium tracking-widest uppercase text-[#FB6300] mb-3"
                        >
                            Pilih paketmu
                        </motion.p>

                        {/* Heading */}
                        <motion.h2
                            custom={0.08}
                            variants={fadeUp}
                            className="text-4xl md:text-[38px] font-medium leading-tight text-[#1D5E84] mb-4"
                        >
                            Mulai kelola bisnis <br />
                            <span className="text-[#FB6300]">resto mu</span> dari sini
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            custom={0.16}
                            variants={fadeUp}
                            className="text-[15px] text-[#26180B]/65 leading-[1.8] mb-8"
                        >
                            Mulai coba gratis dengan mengelola satu tenant,<br />
                            lalu berkembang sesuai ritme bisnis kamu.
                        </motion.p>

                        {/* Stats */}
                        <motion.div
                            custom={0.24}
                            variants={fadeUp}
                            className="flex gap-4 mb-8"
                        >
                            {STATS.map(s => (
                                <div
                                    key={s.label}
                                    className="flex-1 bg-gray-50 rounded-xl border border-gray-100 px-4 py-3"
                                >
                                    <p className="text-2xl font-medium text-[#1D5E84] mb-0.5">{s.num}</p>
                                    <p className="text-[11px] text-[#26180B]/50">{s.label}</p>
                                </div>
                            ))}
                        </motion.div>

                        {/* CTA */}
                        <motion.div custom={0.32} variants={fadeUp}>
                            <Link href="/register">
                                <Button className="bg-[#FB6300] hover:bg-[#e05700] text-white rounded-xl px-6 h-11 text-sm font-medium border-0 gap-2 transition-transform hover:-translate-y-0.5">
                                    <Zap size={15} />
                                    Mulai gratis sekarang
                                    <ArrowRight size={14} />
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* ── Right column — carousel ── */}
                    <motion.div
                        className="flex-shrink-0 flex flex-col items-center"
                        initial="hidden"
                        animate={isInView ? 'visible' : 'hidden'}
                        variants={slideFromRight}
                    >
                        <div className="relative w-[380px] h-[440px] flex items-center justify-center overflow-hidden">

                            {/* Prev button */}
                            <button
                                aria-label="Sebelumnya"
                                onClick={() => setCurrent(prevIdx)}
                                className="absolute left-0 z-40 w-9 h-9 rounded-full flex items-center justify-center bg-[#1D5E84]/10 hover:bg-[#1D5E84]/20 text-[#1D5E84] transition-all duration-200 hover:scale-105"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            {/* Cards */}
                            {total === 0 ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-8 h-8 border-4 border-[#FB6300] border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : (
                                plans.map((plan, idx) => (
                                    <CarouselCard
                                        key={plan.id}
                                        plan={plan}
                                        position={getPosition(idx)}
                                        onClick={() => setCurrent(idx)}
                                    />
                                ))
                            )}

                            {/* Next button */}
                            <button
                                aria-label="Berikutnya"
                                onClick={() => setCurrent(nextIdx)}
                                className="absolute right-0 z-40 w-9 h-9 rounded-full flex items-center justify-center bg-[#1D5E84]/10 hover:bg-[#1D5E84]/20 text-[#1D5E84] transition-all duration-200 hover:scale-105"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>

                        {/* Dots */}
                        {total > 0 && (
                            <div className="flex gap-1.5 mt-3">
                                {plans.map((_, idx) => (
                                    <button
                                        key={idx}
                                        aria-label={`Kartu ${idx + 1}`}
                                        onClick={() => setCurrent(idx)}
                                        className={cn(
                                            'h-2 rounded-full border-none transition-all duration-300 cursor-pointer',
                                            idx === current
                                                ? 'bg-[#FB6300] w-5'
                                                : 'bg-[#1D5E84]/20 hover:bg-[#1D5E84]/40 w-2',
                                        )}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>

                </div>
            </div>
        </section>
    )
}