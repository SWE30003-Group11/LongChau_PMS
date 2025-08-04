# Long Chau Pharmacy Management System

<div align="center">

![Long Chau Pharmacy](public/logo.png)

**Unreservedly honest products that truly work, be kind to health and the planet - no exceptions!**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.1-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Latest-green?style=for-the-badge&logo=supabase)](https://supabase.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [Key Components](#key-components)
- [API Routes](#api-routes)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🏥 Overview

Long Chau Pharmacy Management System is a comprehensive e-commerce and pharmacy management platform built with Next.js 15, React 19, and TypeScript. The system provides a complete solution for managing pharmacy operations, including customer-facing e-commerce features and administrative dashboard capabilities.

### Core Mission
- **Customer-Centric**: Provide seamless shopping experience for health and wellness products
- **Professional**: Maintain high standards for pharmaceutical products and services
- **Transparent**: Ensure honest product information and pricing
- **Accessible**: Serve customers across multiple locations in Vietnam

---

## ✨ Features

### 🛒 E-commerce Features
- **Product Catalog**: Comprehensive inventory with detailed product information
- **Shopping Cart**: Persistent cart with real-time updates
- **User Authentication**: Secure login/registration system
- **Order Management**: Complete order lifecycle tracking
- **Prescription Upload**: Digital prescription management
- **Payment Integration**: Multiple payment gateway support
- **Wishlist**: Save favorite products for later

### 🏥 Pharmacy Management
- **Multi-Branch Support**: Manage 8+ pharmacy locations
- **Inventory Management**: Real-time stock tracking
- **Prescription Processing**: Digital prescription workflow
- **Customer Profiles**: Comprehensive patient records
- **Health Tips**: Educational content and wellness guidance
- **Professional Services**: Licensed pharmacist consultations

### 📊 Administrative Dashboard
- **Analytics Dashboard**: Real-time sales and performance metrics
- **Customer Management**: Complete customer database
- **Order Processing**: Streamlined order fulfillment
- **Inventory Control**: Stock management and alerts
- **Financial Reports**: Revenue and expense tracking
- **Staff Management**: Role-based access control

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach
- **Modern UI/UX**: Clean, professional interface
- **Performance Optimized**: Fast loading times
- **Accessibility**: WCAG compliant design
- **Multi-language Support**: Vietnamese and English

---

## 🛠 Tech Stack

### Frontend
- **Next.js 15.2.4** - React framework with App Router
- **React 19.1.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Primary database
- **Row Level Security** - Data protection
- **Real-time subscriptions** - Live updates

### State Management
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

---

## 📁 Project Structure

```
LongChauPMS/
├── app/                          # Next.js App Router
│   ├── about-us/                 # About page
│   ├── account/                  # User account pages
│   ├── checkout/                 # Checkout process
│   ├── dashboard/                # Admin dashboard
│   ├── gallery/                  # Photo gallery
│   ├── journal/                  # Health articles
│   ├── membership/               # Membership page
│   ├── prescriptions/            # Prescription upload
│   └── shop/                     # E-commerce pages
├── components/                   # Reusable components
│   ├── auth/                     # Authentication components
│   ├── dashboard/                # Dashboard components
│   ├── ui/                       # UI component library
│   └── [feature]/                # Feature-specific components
├── contexts/                     # React contexts
│   ├── AuthContext.tsx           # Authentication state
│   └── NotificationContext.tsx   # Notification system
├── hooks/                        # Custom React hooks
├── lib/                          # Utility libraries
│   ├── supabase/                 # Supabase configuration
│   └── utils.ts                  # Utility functions
├── public/                       # Static assets
│   ├── products/                 # Product images
│   ├── banner/                   # Marketing banners
│   └── [other-assets]/          # Other static files
└── styles/                       # Global styles
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/LongChauPMS.git
   cd LongChauPMS
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Database
pnpm db:setup     # Set up database schema
pnpm db:seed      # Seed with sample data
```

---

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Optional: Payment Gateway
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
```

---

## 🗄 Database Schema

### Core Tables

#### `profiles`
- User account information
- Role-based access control
- Branch assignment

#### `products`
- Product catalog with detailed information
- Prescription requirements
- Stock management

#### `branches`
- Pharmacy locations
- Contact information
- Operating hours

#### `orders`
- Order tracking
- Payment status
- Delivery information

#### `prescriptions`
- Digital prescription uploads
- Approval workflow
- Patient records

### Data Files
- `products.csv` - Product catalog (22 products)
- `branches.csv` - Location data (8 branches)
- `suppliers.csv` - Supplier information

---

## 🧩 Key Components

### Authentication System
- **Protected Routes**: Role-based access control
- **User Profiles**: Comprehensive user management
- **Session Management**: Secure authentication flow

### Shopping Experience
- **Product Catalog**: Rich product information
- **Cart Management**: Persistent shopping cart
- **Checkout Process**: Streamlined payment flow

### Dashboard Analytics
- **Real-time Metrics**: Sales, orders, customers
- **Interactive Charts**: Revenue trends and performance
- **Branch Management**: Multi-location operations

### Health & Wellness
- **Educational Content**: Health tips and articles
- **Prescription Services**: Digital prescription management
- **Professional Consultation**: Licensed pharmacist support

---

## 🔌 API Routes

The application uses Next.js API routes for server-side functionality:

- `/api/auth/*` - Authentication endpoints
- `/api/products/*` - Product management
- `/api/orders/*` - Order processing
- `/api/prescriptions/*` - Prescription handling
- `/api/dashboard/*` - Analytics and reporting

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Environment Setup

Ensure all environment variables are configured in your deployment platform:

- Supabase credentials
- Payment gateway keys
- Analytics tracking IDs

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   pnpm lint
   pnpm build
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain component reusability
- Write meaningful commit messages
- Test thoroughly before submitting

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support and questions:

- **Email**: support@longchaupharmacy.com
- **Phone**: 1800 6928
- **Website**: [longchaupharmacy.com](https://longchaupharmacy.com)

---

<div align="center">

**Built with ❤️ for Long Chau Pharmacy**

*Empowering health and wellness through technology*

</div> 