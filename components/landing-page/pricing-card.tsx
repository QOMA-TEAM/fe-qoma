'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Zap,
    Star,
    Building2,
    CircleCheck,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
} from 'lucide-react'

const PLANS = [
    {
        id: 'free',
        name: 'Free',
        price: 'Rp 0',
        period: '/ 30 hari',
        description: 'Baru mulai? Kelola outlet pertamamu tanpa biaya apapun.',
        badge: { label: 'Starter', icon: Zap },
        features: ['1 Outlet', '3 Pengguna', 'Laporan bulanan', 'Stock dasar'],
        cta: 'Mulai gratis',
        href: '/register',
        variant: 'free' as const,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 'Rp 100.000',
        period: '/ 30 hari',
        description: 'Untuk bisnis berkembang dengan banyak outlet dan tim yang besar.',
        badge: { label: 'Pro', icon: Star },
        features: ['3 Outlet', '20 Pengguna', 'Laporan real-time', 'Stock opname', 'Multi-kasir'],
        cta: 'Upgrade ke Pro',
        href: '/register',
        variant: 'pro' as const,
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 'Custom',
        period: '/ sesuai kebutuhan',
        description: 'Skalakan bisnis franchise dan chain resto besar kamu tanpa batas.',
        badge: { label: 'Enterprise', icon: Building2 },
        features: [
            'Outlet tak terbatas',
            'Pengguna tak terbatas',
            'Dashboard pusat',
            'Integrasi API',
            'Dedicated support',
        ],
        cta: 'Hubungi kami',
        href: '/contact',
        variant: 'enterprise' as const,
    },
]

const STATS = [
    { num: '500+', label: 'Bisnis aktif' },
    { num: '30 hr', label: 'Coba gratis' },
]

type PlanVariant = 'free' | 'pro' | 'enterprise'

const cardStyles: Record<PlanVariant, { card: string; badge: string; text: string; sub: string; divider: string; feature: string; icon: string; btn: string }> = {
    free: {
        card: 'bg-white border border-[#1D5E84]/10',
        badge: 'bg-[#FB6300]/10 text-[#FB6300] border-0',
        text: 'text-[#1D5E84]',
        sub: 'text-[#26180B]/60',
        divider: 'bg-[#1D5E84]/10',
        feature: 'text-[#26180B]',
        icon: 'text-[#FB6300]',
        btn: 'bg-[#FB6300] hover:bg-[#e05700] text-white',
    },
    pro: {
        card: 'bg-[#1D5E84] border border-[#1D5E84]',
        badge: 'bg-white/20 text-white border-0',
        text: 'text-white',
        sub: 'text-white/65',
        divider: 'bg-white/15',
        feature: 'text-white',
        icon: 'text-[#FCFEF1]',
        btn: 'bg-[#FCFEF1] hover:bg-white text-[#1D5E84]',
    },
    enterprise: {
        card: 'bg-[#FB6300] border border-[#FB6300]',
        badge: 'bg-white/25 text-white border-0',
        text: 'text-white',
        sub: 'text-white/70',
        divider: 'bg-white/20',
        feature: 'text-white',
        icon: 'text-white',
        btn: 'bg-white hover:bg-white/90 text-[#FB6300]',
    },
}

interface PlanCardProps {
    plan: (typeof PLANS)[number]
    position: 'prev' | 'cur' | 'next'
    onClick: () => void
}

function PlanCard({ plan, position, onClick }: PlanCardProps) {
    const s = cardStyles[plan.variant]
    const BadgeIcon = plan.badge.icon
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
            <Card className={cn('rounded-[18px] border shadow-none', s.card)}>
                <CardContent className="p-6">
                    <Badge className={cn('mb-4 gap-1.5 text-[11px] font-medium rounded-full px-3 py-1', s.badge)}>
                        <BadgeIcon size={11} />
                        {plan.badge.label}
                    </Badge>

                    <p className={cn('text-xl font-medium mb-1', s.text)}>{plan.name}</p>
                    <p className={cn('text-2xl font-medium mb-0.5', s.text)}>{plan.price}</p>
                    <p className={cn('text-xs mb-3', s.sub)}>{plan.period}</p>
                    <p className={cn('text-xs leading-relaxed mb-4', s.sub)}>{plan.description}</p>

                    <div className={cn('h-px mb-4', s.divider)} />

                    <ul className="space-y-2 mb-5">
                        {plan.features.map((feat) => (
                            <li key={feat} className={cn('flex items-center gap-2 text-xs', s.feature)}>
                                <CircleCheck size={14} className={cn('shrink-0', s.icon)} />
                                {feat}
                            </li>
                        ))}
                    </ul>

                    <Link href={plan.href}>
                        <Button
                            className={cn(
                                'w-full rounded-xl text-sm font-medium h-10 transition-opacity border-0',
                                s.btn,
                            )}
                        >
                            {plan.cta}
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}

export function PricingSection() {
    const [current, setCurrent] = useState(1)
    const [mounted, setMounted] = useState(false)
    const total = PLANS.length

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50)
        return () => clearTimeout(t)
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
                            {PLANS.map((plan, idx) => (
                                <PlanCard
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
                            {PLANS.map((_, idx) => (
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