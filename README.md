# QOMA Frontend

Aplikasi frontend untuk **QOMA (QR Order Management Application)**, sebuah platform SaaS Point of Sale (POS) yang dirancang untuk membantu bisnis makanan dan minuman dalam mengelola pemesanan, inventaris, laporan keuangan, dan layanan subscription.

---

## 🚀 Fitur

### Landing Page

* Pengenalan bisnis
* Paket harga (pricing plan)
* Registrasi owner
* Upgrade subscription

### Pelanggan

* Pemesanan melalui QR Code
* Melihat kategori menu
* Menambahkan menu ke keranjang
* Kustomisasi add-on
* Konfirmasi pesanan tanpa login

### Outlet

* Manajemen pesanan
* Konfirmasi pembayaran
* Monitoring inventaris
* Manajemen stock opname
* Manajemen QR meja
* Monitoring pendapatan
* Activity log

### Owner

* Manajemen multi-outlet
* Manajemen menu
* Manajemen bahan baku
* Dashboard keuangan
* Manajemen subscription
* Analitik bisnis

### Super Admin

* Dashboard monitoring SaaS
* Manajemen subscription
* Analitik Monthly Recurring Revenue (MRR)
* Manajemen pelanggan
* Manajemen notifikasi

---

## 🛠️ Teknologi yang Digunakan

### Framework

* Next.js 15
* React 19
* TypeScript

### Styling

* Tailwind CSS
* Shadcn/UI
* Lucide React Icons

### State Management

* React Context API
* TanStack Query

### Form Handling

* React Hook Form
* Zod Validation

### Integrasi API

* Axios
* Laravel REST API

### Authentication

* JWT Authentication
* Role-Based Access Control (RBAC)

---

## 📂 Struktur Project

```bash
src/
├── app/
├── components/
├── hooks/
├── lib/
├── services/
├── types/
├── providers/
├── context/
├── constants/
└── utils/
```

---

## ⚙️ Memulai Project

### Prasyarat

Pastikan sudah menginstal:

* Node.js 20+
* npm / pnpm / yarn

---

### Instalasi

Clone repository:

```bash
git clone https://github.com/your-username/qoma-frontend.git
```

Masuk ke direktori project:

```bash
cd qoma-frontend
```

Install dependencies:

```bash
npm install
```

---

### Environment Variables

Buat file `.env.local` pada root project:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=QOMA
```

Sesuaikan URL API dengan konfigurasi backend yang digunakan.

---

### Menjalankan Development Server

```bash
npm run dev
```

Buka:

```bash
http://localhost:3000
```

---

## 🔗 Repository Backend

QOMA Frontend terhubung dengan backend Laravel REST API yang menggunakan database Supabase PostgreSQL.

Fitur Backend:

* Authentication
* QR Ordering
* Inventory Management
* Financial Management
* Subscription Management
* Multi-Tenant Architecture

---

## 👥 Role Pengguna

### Pelanggan

Mengakses sistem pemesanan melalui QR Code tanpa perlu login.

### Outlet

Mengelola pesanan, inventaris, stock opname, dan laporan keuangan cabang.

### Owner

Mengelola outlet, menu, bahan baku, subscription, dan analitik bisnis.

### Super Admin

Mengelola platform SaaS, subscription, dan metrik bisnis secara keseluruhan.

---

## 📊 Modul Utama

* Authentication & Authorization
* QR Ordering System
* Shopping Cart
* Order Management
* Inventory Management
* Stock Opname
* Financial Dashboard
* Subscription Management
* Activity Logs
* Notification System

---

## 🎯 Tujuan Project

QOMA bertujuan untuk mendigitalisasi operasional restoran dan kafe dengan menggabungkan sistem pemesanan berbasis QR Code, manajemen inventaris, monitoring keuangan, dan administrasi multi-outlet dalam satu platform SaaS.

---

## 👨‍💻 Developer

Dikembangkan sebagai project Full Stack SaaS POS menggunakan:

* Frontend: Next.js + TypeScript
* Backend: Laravel
* Database: Supabase PostgreSQL
* UI: Tailwind CSS + Shadcn/UI
