# Finance Dashboard

A modern, feature-rich personal finance dashboard built with Next.js, TypeScript, and PostgreSQL.

## Features

- 💰 **Transaction Management** - Track income and expenses
- 📊 **Budget Planning** - Set and monitor spending limits
- 📈 **Investment Tracking** - Monitor stocks, crypto, and ETFs
- 🔐 **Secure Authentication** - User accounts with session management
- 📱 **Responsive Design** - Works on all devices
- 📄 **Data Export** - Export transactions and reports (CSV, JSON)
- 🎯 **Real-time Analytics** - Charts and financial insights

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, PostgreSQL
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **Deployment**: Vercel/Azure ready

## Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Set up database**: 
   - Start PostgreSQL
   - Update `.env.local` with your database URL
   - Run `npm run db:init`
4. **Run development server**: `npm run dev`
5. **Open**: http://localhost:3000

## Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/finance_dashboard"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"