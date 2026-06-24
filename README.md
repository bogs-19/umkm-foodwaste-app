# 🍃 UMKM FoodWaste Management System

**[🚀 CLICK HERE TO VIEW LIVE DEMO](https://bogs-19.github.io/umkm-foodwaste-app/)**
> *Note: This is a client-side demonstration. No backend installation is required to test the application.*

---

## 🔐 Demo Access Credentials
To explore the application and its features, please use the following simulated credentials on the Login page:
*   **Username:** `admin`
*   **Password:** `admin123`

---

## 📖 Project Overview
The **FoodWaste Management System** is a professional, high-performance web dashboard application specifically designed to help Micro, Small, and Medium Enterprises (MSMEs / UMKM) in the culinary sector. The primary goal is to efficiently manage kitchen inventory, proactively reduce food waste, and automate daily operational briefings.

Built with a "Mobile-First" and "Enterprise Dark Mode" design philosophy, the app ensures that kitchen managers can effortlessly monitor stock levels and take immediate action on near-expiry items.

## ✨ Key Features & Modules

### 1. Smart Daily Briefing (`react-tinder-card`)
*   An innovative, gamified approach to daily inventory auditing.
*   Features a Tinder-style swipe interface (Swipe Right to mark as "Safe", Swipe Left to mark as "Set Aside").
*   Fluid animations and responsive touch gestures optimized for mobile devices.

### 2. Comprehensive Inventory Management
*   **CRUD Operations:** Add, view, edit, and delete raw materials.
*   **Base64 Image Upload:** Users can upload custom images for items, which are dynamically processed and stored locally.
*   **Automated Status Tagging:** Items are automatically tagged as *Aman* (Safe), *Kurang* (Low), or *Kritis* (Critical) based on stock levels and expiration dates.

### 3. Actionable Waste Reduction (Flash Sales & Donations)
*   The system actively prompts users to take action on "Critical" items.
*   **Promo Module:** Quickly generate promotional data to sell near-expiry items at a discount.
*   **Donation Module:** Allocate excessive or nearing-expiration consumable goods to charitable partners.

### 4. Interactive Analytics Dashboard
*   Visualizes the weekly performance of saved vs. wasted food items.
*   Powered by `Chart.js` for lightweight, responsive, and beautiful data representation.

### 5. Client-Side State & Data Persistence
*   Fully functional without a backend server for demonstration purposes.
*   Utilizes HTML5 `localStorage` for robust, persistent data management across browser sessions.

---

## 🛠️ Technology Stack

**Core Development:**
*   [React.js](https://reactjs.org/) - Frontend UI Library
*   [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
*   [React Router DOM](https://reactrouter.com/) - Application Routing (Configured with HashRouter for GitHub Pages compatibility)

**UI/UX & Styling:**
*   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for rapid UI development
*   [Lucide React](https://lucide.dev/) - Beautiful and consistent iconography
*   [Framer Motion](https://www.framer.com/motion/) & CSS Keyframes - Smooth transitions and micro-interactions

**Data Visualization & Interactions:**
*   [Chart.js](https://www.chartjs.org/) & `react-chartjs-2` - Dashboard analytics
*   [React Tinder Card](https://github.com/3DJakob/react-tinder-card) - Swipeable card interface

---

## 💻 Local Development Setup

If you wish to run this project locally, explore the codebase, or contribute, follow these steps:

### Prerequisites
*   Node.js (v18 or higher)
*   pnpm (recommended), npm, or yarn

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/bogs-19/umkm-foodwaste-app.git
Navigate to the directory:

cd umkm-foodwaste-app


3. **Install dependencies:**
   ```bash
pnpm install
Start the development server:

Bash
pnpm run dev

---

## 🎨 Design Philosophy
This application adopts a **"Dark Mode Enterprise"** aesthetic. By utilizing deep background colors (`#0F172A`, `#1C1C24`) contrasted with vibrant, semantic accent colors (Green for safe/success, Red for critical alerts), the UI reduces eye strain and implements "Zoning by Contrast." This ensures that critical actions (like expiring items) immediately draw the user's attention.
