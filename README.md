# QOMA Frontend

Frontend application for **QOMA (QR Order Management Application)**, a SaaS Point of Sale (POS) platform designed for food and beverage businesses. This application provides interfaces for Customers, Outlets, Owners, and Super Admins to manage ordering, inventory, financial reporting, and subscription services.

---

## 🚀 Features

### Landing Page

* Business introduction
* Pricing plans
* Owner registration
* Subscription upgrade

### Customer

* QR Code ordering
* Browse menu categories
* Add menu to cart
* Add-on customization
* Order confirmation without login

### Outlet

* Order management
* Payment confirmation
* Inventory monitoring
* Stock opname management
* QR table management
* Revenue monitoring
* Activity logs

### Owner

* Multi-outlet management
* Menu management
* Ingredient management
* Financial dashboard
* Subscription management
* Business analytics

### Super Admin

* SaaS monitoring dashboard
* Subscription management
* Monthly Recurring Revenue (MRR) analytics
* Customer management
* Notifications management

---

## 🛠️ Tech Stack

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

### API Integration

* Axios
* Laravel REST API

### Authentication

* JWT Authentication
* Role-Based Access Control (RBAC)

---

## 📂 Project Structure

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

## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

* Node.js 20+
* npm / pnpm / yarn

---

### Installation

Clone the repository:

```bash
git clone https://github.com/your-username/qoma-frontend.git
```

Move to project directory:

```bash
cd qoma-frontend
```

Install dependencies:

```bash
npm install
```

---

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=QOMA
```

Adjust the API URL according to your backend configuration.

---

### Run Development Server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## 🔗 Backend Repository

QOMA Frontend communicates with a Laravel REST API backend connected to Supabase PostgreSQL.

Backend Features:

* Authentication
* QR Ordering
* Inventory Management
* Financial Management
* Subscription Management
* Multi-Tenant Architecture

---

## 👥 User Roles

### Customer

Access ordering system through QR Code without authentication.

### Outlet

Manage orders, inventory, stock opname, and local financial reports.

### Owner

Manage outlets, menus, ingredients, subscriptions, and business analytics.

### Super Admin

Manage SaaS platform, subscriptions, and overall business metrics.

---

## 📊 Core Modules

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

## 🎯 Project Goal

QOMA aims to digitalize restaurant and café operations by combining QR-based ordering, inventory management, financial monitoring, and multi-outlet administration into a single SaaS platform.

---

## 👨‍💻 Developer

Developed as a Full Stack SaaS POS project using:

* Frontend: Next.js + TypeScript
* Backend: Laravel
* Database: Supabase PostgreSQL
* UI: Tailwind CSS + Shadcn/UI
