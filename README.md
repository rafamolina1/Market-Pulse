# MarketPulse 📊

> **Modern Real-Time Financial Dashboard** - A sophisticated, technical showcase of assets tracking with premium design and industrial-grade architecture.

[![Status](https://img.shields.io/badge/status-production--ready-success?style=for-the-badge)](https://github.com/rafamolina1/MarketPulseOfc)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.1.0-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![i18n](https://img.shields.io/badge/i18n-Multilingual-FF6633?style=for-the-badge)](https://www.i18next.com/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-blueviolet?style=for-the-badge)](https://vite-pwa-org.netlify.app/)

---

## 🌟 Overview

MarketPulse is a high-performance financial dashboard designed for modern investors. It provides a technical and visual masterclass in real-time data management, featuring a TRON-inspired aesthetic with advanced glassmorphism.

### 🚀 Key Features

- 📁 **Advanced Portfolio Tracking** - Manage your holdings with real-time P&L (Profit & Loss) calculations across currencies, cryptos, and commodities.
- 📱 **Progressive Web App (PWA)** - Installable on any device with offline capabilities and a native-like experience.
- 🌐 **Globalized Interface** - Fully localized in **English** and **Portuguese (BR)** with precise currency formatting.
- 📊 **Dynamic Visualizations** - Interactive historical charts powered by **Chart.js** with premium gradients and smooth animations.
- 📥 **Enterprise-Grade Exporting** - Generate professional **PDF reports** and **CSV datasets** of your portfolio instantly.
- 🛡️ **Fault-Tolerant Architecture** - Robust error handling with React Error Boundaries and graceful recovery.
- ⚡ **Performance Optimized** - Sub-second load times via lazy loading, memoization, and efficient Context API state management.
- 💱 **Integrated Converter** - Real-time currency conversion logic for global pairs.

## 🛠️ Technical Stack

- **Framework**: React 18 (Hooks & Context API)
- **Tooling**: Vite (Ultra-fast HMR)
- **Styling**: Vanilla CSS (Custom Design Tokens, Glassmorphism)
- **State Management**: Multi-Context Architecture (Market, Portfolio, Theme)
- **Data Persistence**: LocalStorage with automatic synchronization
- **Real-Time Data**: WebSocket integration (Binance API for Cryptos)
- **PWA**: `vite-plugin-pwa` with custom Service Workers
- **Exporting**: `jsPDF` & `jsPDF-AutoTable` (Lazy-loaded)

## 📁 Project Structure

```text
MarketPulseOfc/
├── src/
│   ├── components/        # Specialized UI Components
│   │   ├── PortfolioModal.jsx  # Complex CRUD & Logic
│   │   ├── HistoricalChart.jsx # Data Visualization
│   │   └── SplashScreen.jsx    # Premium Intro Animation
│   ├── contexts/          # State-driven Architecture
│   │   ├── MarketContext.jsx   # Real-time WebSocket Logic
│   │   └── PortfolioContext.jsx# CRUD Operations & Persistence
│   ├── services/          # Data Layer (APIs & Simulations)
│   │   ├── websocketService.js # High-level WS abstraction
│   │   ├── exportService.js    # PDF/CSV Generation
│   │   └── portfolioService.js # Business Logic & Math
│   ├── locales/           # Internationalization (JSON)
│   ├── utils/             # Technical Utilities (Formatters)
│   ├── index.css          # Design System & Tokens
│   └── main.jsx           # Entry Configuration
```

## 🎨 Design Philosophy: "TRON Modern"

The UI is built on a custom design system focused on high contrast and technical depth:
- **Primary Color**: `#FF7F3E` (TRON Orange)
- **Background**: Deep Obsidian Layering (`#0A0A0F`, `#121218`)
- **Effects**: Backdrop blur (20px), linear gradients, and energy pulses on interaction.

## 🔧 Installation & Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/rafamolina1/MarketPulseOfc.git
   npm install
   ```

2. **Environment**
   ```bash
   cp .env.example .env
   ```

3. **Development**
   ```bash
   npm run dev
   ```

4. **Production Build**
   ```bash
   npm run build
   npm run preview
   ```

## 👤 Author

**Rafael Molina**
- GitHub: [@rafamolina1](https://github.com/rafamolina1)

---
⭐ **MarketPulse** - Proactively engineered for clarity and performance.
