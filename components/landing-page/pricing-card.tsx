import Link from 'next/link'
import { PlanCard } from '@/components/ui/plan-card'
import { CheckCircle2, Zap, Star } from 'lucide-react'

export function PricingSection() {
    return (
        <section id="pricing" className="w-full bg-white py-24 border-t border-gray-100">
            <div className="w-full max-w-6xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Pricing</h2>
                    <p className="text-gray-500 text-lg">
                        Mulai gratis, upgrade kapan saja sesuai kebutuhan bisnis kamu.
                    </p>
                </div>

                {/* Cards — grid supaya tinggi otomatis sama */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">

                    {/* Free Plan */}
                    <PlanCard
                        name="Free"
                        price={0}
                        period="30 Hari"
                        description="Cocok untuk kamu yang baru mulai mengelola bisnis F&B pertama."
                        className="h-full"
                        headerBadge={
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-white text-gray-500 border border-gray-200">
                                <Zap size={11} />
                                Starter
                            </span>
                        }
                        features={[
                            {
                                icon: <CheckCircle2 size={15} className="text-[#C4C4C4]" />,
                                text: '1 Outlet',
                            },
                            {
                                icon: <CheckCircle2 size={15} className="text-[#C4C4C4]" />,
                                text: '3 Pengguna',
                            },
                            {
                                icon: <CheckCircle2 size={15} className="text-[#C4C4C4]" />,
                                text: 'Laporan bulanan',
                            },
                            {
                                icon: <CheckCircle2 size={15} className="text-[#C4C4C4]" />,
                                text: 'Stock dasar',
                            },
                        ]}
                        actionButton={
                            <Link
                                href="/register"
                                className="block w-full py-3 px-4 bg-[#FB6300] hover:bg-[#e05700] text-white text-center font-semibold text-sm rounded-xl transition-colors"
                            >
                                Mulai gratis
                            </Link>
                        }
                    />

                    {/* Pro Plan */}
                    <PlanCard
                        name="Pro"
                        price={100000}
                        period="30 Hari"
                        description="Untuk bisnis yang berkembang dengan kebutuhan lebih dari satu outlet."
                        className="h-full bg-[#dde8f7]"
                        headerBadge={
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-[#3874BC] text-white">
                                <Star size={11} />
                                Pro
                            </span>
                        }
                        features={[
                            {
                                icon: <CheckCircle2 size={15} className="text-[#3874BC]" />,
                                text: '3 Outlet',
                            },
                            {
                                icon: <CheckCircle2 size={15} className="text-[#3874BC]" />,
                                text: '20 Pengguna',
                            },
                            {
                                icon: <CheckCircle2 size={15} className="text-[#3874BC]" />,
                                text: 'Laporan real-time',
                            },
                            {
                                icon: <CheckCircle2 size={15} className="text-[#3874BC]" />,
                                text: 'Stock opname',
                            },
                            {
                                icon: <CheckCircle2 size={15} className="text-[#3874BC]" />,
                                text: 'Multi-kasir',
                            },
                        ]}
                        actionButton={
                            <Link
                                href="/register"
                                className="block w-full py-3 px-4 bg-[#3874BC] hover:bg-[#2d5f9e] text-white text-center font-semibold text-sm rounded-xl transition-colors"
                            >
                                Upgrade ke Pro
                            </Link>
                        }
                    />

                </div>
            </div>
        </section>
    )
}