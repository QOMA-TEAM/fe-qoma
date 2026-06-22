'use client'

// ─── Types ────────────────────────────────────────────────────────────────────

type AvatarColor = 'orange' | 'blue' | 'dark'
type TagVariant = 'orange' | 'blue'

interface ReviewCardProps {
    initials: string
    name: string
    role: string
    color: AvatarColor
    stars: number
    text: string
    tag: string
    tagVariant: TagVariant
}

// ─── Dummy Data ───────────────────────────────────────────────────────────────

const row1Reviews: ReviewCardProps[] = [
    {
        initials: 'AR',
        name: 'Andi Rahmat',
        role: 'Pemilik Warung Kopi',
        color: 'orange',
        stars: 5,
        text: 'Sejak pakai sistem ini, proses order di kasir jadi jauh lebih cepat. Customer ga perlu nunggu lama dan antrian berkurang drastis.',
        tag: 'POS Kasir',
        tagVariant: 'orange',
    },
    {
        initials: 'SL',
        name: 'Siti Lestari',
        role: 'Manajer Restoran',
        color: 'blue',
        stars: 5,
        text: 'Fitur manajemen stok-nya keren banget. Sekarang aku bisa monitor stok bahan baku real-time tanpa harus cek manual tiap hari.',
        tag: 'Manajemen Stok',
        tagVariant: 'blue',
    },
    {
        initials: 'BW',
        name: 'Budi Wicaksono',
        role: 'Pemilik Cafe Chain',
        color: 'dark',
        stars: 5,
        text: 'Laporan penjualan per outlet bisa aku pantau dari satu dashboard. Sangat membantu buat pengambilan keputusan bisnis.',
        tag: 'Multi-Outlet',
        tagVariant: 'orange',
    },
    {
        initials: 'DP',
        name: 'Dewi Permata',
        role: 'Owner FnB Franchise',
        color: 'blue',
        stars: 5,
        text: 'Sistem pesanan onlinenya terintegrasi langsung ke dapur. Orderan dari meja, app, maupun QR code masuk ke satu tempat.',
        tag: 'Integrasi Pesanan',
        tagVariant: 'blue',
    },
    {
        initials: 'RH',
        name: 'Rizky Hakim',
        role: 'Pengelola Kantin',
        color: 'orange',
        stars: 5,
        text: 'Stock opname yang biasanya makan waktu berjam-jam, sekarang selesai dalam 30 menit. Fitur foto bukti-nya juga sangat membantu audit.',
        tag: 'Stock Opname',
        tagVariant: 'orange',
    },
    {
        initials: 'NA',
        name: 'Nadia Aulia',
        role: 'Supervisor Outlet',
        color: 'dark',
        stars: 5,
        text: 'Manajemen menu bisa diubah dari mana saja, gak perlu ke lokasi langsung. Sangat praktis saat ada promo mendadak.',
        tag: 'Manajemen Menu',
        tagVariant: 'blue',
    },
    {
        initials: 'TK',
        name: 'Tommy Kurniawan',
        role: 'Pemilik Bakery',
        color: 'orange',
        stars: 5,
        text: 'Notifikasi stok hampir habis bikin aku gak pernah kehabisan bahan lagi. Reorder jadi lebih terencana dan efisien.',
        tag: 'Manajemen Stok',
        tagVariant: 'orange',
    },
]

const row2Reviews: ReviewCardProps[] = [
    {
        initials: 'YP',
        name: 'Yusuf Pranata',
        role: 'Direktur Operasional',
        color: 'blue',
        stars: 5,
        text: 'Data penjualan semua outlet bisa aku bandingkan langsung. Outlet mana yang perlu perhatian lebih langsung keliatan dari grafik.',
        tag: 'Analitik',
        tagVariant: 'blue',
    },
    {
        initials: 'MF',
        name: 'Maya Fitriani',
        role: 'Kasir Restoran',
        color: 'orange',
        stars: 5,
        text: 'Tampilannya simpel dan gampang dipahami. Training karyawan baru jadi lebih cepat karena sistemnya intuitif banget.',
        tag: 'Kemudahan Pakai',
        tagVariant: 'orange',
    },
    {
        initials: 'GS',
        name: 'Galih Santoso',
        role: 'Owner Coffee Shop',
        color: 'dark',
        stars: 5,
        text: 'Laporan harian langsung dikirim ke WhatsApp. Gak perlu buka laptop dulu buat tau omzet hari ini, praktis!',
        tag: 'Laporan Otomatis',
        tagVariant: 'blue',
    },
    {
        initials: 'IL',
        name: 'Intan Laksmi',
        role: 'Manajer Cabang',
        color: 'orange',
        stars: 5,
        text: 'Fitur pembatasan akses per role sangat membantu. Kasir hanya bisa lihat yang perlu dilihat, data sensitif tetap aman.',
        tag: 'Keamanan Data',
        tagVariant: 'orange',
    },
    {
        initials: 'HN',
        name: 'Hendra Nugroho',
        role: 'Pemilik Warung Makan',
        color: 'blue',
        stars: 5,
        text: 'Pelanggan bisa scan QR dan langsung pilih menu sendiri. Pesanan masuk otomatis, kerja tim dapur jadi lebih terorganisir.',
        tag: 'Self-Order QR',
        tagVariant: 'blue',
    },
    {
        initials: 'CS',
        name: 'Clara Setiawan',
        role: 'F&B Consultant',
        color: 'dark',
        stars: 5,
        text: 'Sudah rekomendasikan platform ini ke belasan klien. Hampir semua kasih feedback positif soal kemudahan onboarding dan stabilitas sistemnya.',
        tag: 'Rekomendasi',
        tagVariant: 'orange',
    },
    {
        initials: 'FK',
        name: 'Fajar Kusuma',
        role: 'GM Hotel Restaurant',
        color: 'orange',
        stars: 5,
        text: 'Integrasi antara sistem pesanan meja dan inventory benar-benar mulus. Tidak ada lagi kejadian pesanan masuk tapi bahan sudah habis.',
        tag: 'Integrasi Sistem',
        tagVariant: 'blue',
    },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const avatarStyles: Record<AvatarColor, string> = {
    orange: 'bg-[#FB6300]/10 text-[#C45000]',
    blue: 'bg-[#1D5E84]/10 text-[#1D5E84]',
    dark: 'bg-[#26180B]/8  text-[#26180B]',
}

const tagStyles: Record<TagVariant, string> = {
    orange: 'bg-[#FB6300]/10 text-[#C45000]',
    blue: 'bg-[#1D5E84]/10 text-[#1D5E84]',
}

// ─── ReviewCard ───────────────────────────────────────────────────────────────

function ReviewCard({ initials, name, role, color, stars, text, tag, tagVariant }: ReviewCardProps) {
    return (
        <div
            className="
        flex-shrink-0 w-[290px]
        bg-white/70 hover:bg-white/90
        border border-[#FB6300]/10 hover:border-[#FB6300]/40
        rounded-2xl p-5
        transition-all duration-300
      "
        >
            {/* Header: avatar + name */}
            <div className="flex items-center gap-2.5 mb-3">
                <div
                    className={`
            w-9 h-9 rounded-full flex items-center justify-center
            text-[13px] font-medium flex-shrink-0
            ${avatarStyles[color]}
          `}
                >
                    {initials}
                </div>
                <div>
                    <p className="text-[13px] font-medium text-[#26180B] leading-tight m-0">{name}</p>
                    <p className="text-[11px] text-[#26180B]/45 m-0">{role}</p>
                </div>
            </div>

            {/* Stars */}
            <div className="flex gap-0.5 mb-2">
                {Array.from({ length: stars }).map((_, i) => (
                    <span key={i} className="text-[#FB6300] text-[13px]">★</span>
                ))}
            </div>

            {/* Review text */}
            <p className="text-[13px] text-[#26180B]/68 leading-relaxed m-0">{text}</p>

            {/* Tag */}
            <span
                className={`
          inline-block mt-2.5 text-[10px] font-medium
          px-2.5 py-0.5 rounded-full tracking-wide
          ${tagStyles[tagVariant]}
        `}
            >
                {tag}
            </span>
        </div>
    )
}

// ─── MarqueeRow ───────────────────────────────────────────────────────────────

interface MarqueeRowProps {
    reviews: ReviewCardProps[]
    direction: 'left' | 'right'
}

function MarqueeRow({ reviews, direction }: MarqueeRowProps) {
    // Duplicate array so the loop is seamless
    const doubled = [...reviews, ...reviews]

    const animationClass =
        direction === 'left'
            ? 'animate-[marquee-left_38s_linear_infinite]'
            : 'animate-[marquee-right_42s_linear_infinite]'

    return (
        <div className="overflow-hidden w-full">
            <div
                className={`flex gap-4 w-max hover:[animation-play-state:paused] ${animationClass}`}
            >
                {doubled.map((review, i) => (
                    <ReviewCard key={i} {...review} />
                ))}
            </div>
        </div>
    )
}

// ─── ReviewMarquee (main export) ─────────────────────────────────────────────

export function ReviewMarquee() {
    return (
        <section className="bg-[#FCFEF1] py-14 overflow-hidden w-full">
            {/* Heading */}
            <div className="text-center mb-10 px-8">
                <p className="text-[#FB6300] text-xs uppercase tracking-widest font-medium mb-1">
                    Dipercaya ratusan outlet
                </p>
                <h2 className="text-[#26180B] text-3xl font-medium leading-snug m-0">
                    Apa kata mereka tentang platform kami
                </h2>
            </div>

            {/* Marquee rows */}
            <div className="flex flex-col gap-4">
                <MarqueeRow reviews={row1Reviews} direction="left" />
                <MarqueeRow reviews={row2Reviews} direction="right" />
            </div>
        </section>
    )
}