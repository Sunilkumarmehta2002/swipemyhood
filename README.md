# 🏠 SwipeMyHood – Bangalore Neighborhood Discovery Platform

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7.1-orange.svg)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)

---

## 📑 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [📁 Folder Structure](#-folder-structure)
- [🚀 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [📖 Usage](#-usage)
- [🛡️ Admin Panel](#️-admin-panel)
- [🧠 ML Matching Algorithm](#-ml-matching-algorithm)
- [🧪 Testing](#-testing)
- [📱 Mobile Optimized](#-mobile-optimized)
- [🙌 Contributing](#-contributing)
- [📄 License](#-license)
- [🚨 Production Reminder](#-production-reminder)
- [🙋‍♂️ Support](#-support)

---

## 🌟 Overview

**SwipeMyHood** is an intelligent, swipe-based neighborhood discovery platform crafted for Bangalore. It enables users to explore and match with neighborhoods that align with their lifestyle preferences using an ML-powered engine.

🔍 **Problem Solved:**  
Many urban newcomers struggle to choose the right neighborhood that suits their lifestyle. **SwipeMyHood** bridges this gap by combining user preferences, public data, and ML-driven matching to deliver personalized neighborhood recommendations in Bangalore.

---
🔗 **Live Deployed App:**  
👉 [https://swipemyhood.vercel.app/](https://swipemyhood.vercel.app/)

---

## ✨ Features

### 👥 User Side

- 🔄 Swipe-to-match interface
- 🧠 ML-powered lifestyle recommendation engine
- 📋 Interactive onboarding to capture preferences
- 🛎️ Book services: consultation, tour, or relocation
- 🔐 Secure user authentication (email/password & Google)

### 🛡️ Admin Side

- 📊 Dashboard with engagement & match analytics
- 👥 User management (edit/delete/promote)
- 💬 Contact form handling with reply support
- ⚙️ Customizable ML algorithm & data settings
- 🔐 Route protection and access control via Firebase

---

## 🛠️ Tech Stack

| Layer     | Tools |
|-----------|-------|
| Frontend  | React, TypeScript, Tailwind CSS, Vite |
| Backend   | Firebase (Auth, Firestore, Hosting, Cloud Functions) |
| UI/UX     | Framer Motion, React Router DOM, Lucide Icons, React Hot Toast |
| Dev Tools | ESLint, Prettier, GitHub |

---

## 📁 Folder Structure

```
├── public/               # Static assets
├── src/
│   ├── assets/           # Images, icons
│   ├── components/       # Reusable UI components
│   ├── pages/            # Route-level components
│   ├── lib/              # Firebase config, utilities
│   ├── hooks/            # Custom React hooks
│   ├── styles/           # Tailwind + global CSS
│   └── main.tsx          # App entry point
├── .env.example          # Environment variables template
├── firebase.json         # Firebase deployment config
├── vite.config.ts        # Vite build setup
```

---

## 🚀 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/swipe-my-hood.git
cd swipe-my-hood

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start the development server
npm run dev
```

---

## ⚙️ Configuration

1. Create a Firebase project [here](https://console.firebase.google.com/).
2. In the Firebase console:
   - Enable **Authentication** (Email/Password & Google)
   - Set up **Cloud Firestore**
   - Deploy **Functions & Hosting** if needed

### 🛠️ .env Setup

Rename `.env.example` to `.env` and fill in:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=your_project_url
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## 📖 Usage

### 👤 User Flow

1. Sign up or log in
2. Complete onboarding form
3. Swipe through neighborhoods
4. View matches and explore more details
5. Book services (consultation, guided tour, or relocation support)

---

## 🛡️ Admin Panel

### 🔐 Admin Login

Visit the dedicated admin login page:  
➡️ [`http://localhost:5173/admin-login`](http://localhost:5173/admin-login)

### Default Credentials (Change in Production!)

```
Email:    admin@swipemyhood.in
Password: admin123456
```

### 🔧 Setup Guide

#### Option A: In-Browser Setup

1. Run the dev server: `npm run dev`
2. Visit `http://localhost:5173/admin-login`
3. Open browser dev console and execute:

```js
setupAdmin();
```

#### Option B: Manual Firebase Setup

1. Create a user with email: `admin@swipemyhood.in` in Firebase Auth
2. In Firestore → `users` → Add document:

```json
{
  "email": "admin@swipemyhood.in",
  "name": "Admin User",
  "isAdmin": true,
  "createdAt": "timestamp",
  "lastActive": "timestamp"
}
```

### 📊 Admin Dashboard Features

- **Overview Tab**: See active users, matches, and site metrics
- **Users Tab**: View/edit/delete users and assign admin privileges
- **Messages Tab**: Review user contact messages and respond
- **Settings Tab**: Adjust algorithm weights and location metadata

### 🛡️ Security Measures

- Role-based route protection
- Firestore access rules
- Audit logs of admin actions
- Input validation on sensitive routes

---

## 🧠 ML Matching Algorithm

- Collects lifestyle preferences (e.g., nightlife, safety, commute)
- Each neighborhood is scored on key parameters using public data/APIs
- Uses a weighted scoring system (or cosine similarity) to calculate best matches
- Admins can tune weights dynamically from the dashboard

---

## 🧪 Testing

```bash
# Run lint checks
npm run lint

# (Optional) Add unit/component tests using vitest/jest
npm run test
```

---

## 📱 Mobile Optimized

SwipeMyHood is designed with mobile-first responsiveness using Tailwind CSS and Framer Motion. Perfect for users browsing on smartphones.

---

## 🙌 Contributing

Contributions are welcome! Here's how:

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/awesome-feature`
3. Commit your changes: `git commit -m "feat: add awesome feature"`
4. Push to the branch: `git push origin feature/awesome-feature`
5. Open a Pull Request

Make sure your code passes linting and builds successfully before opening a PR.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🚨 Production Reminder

**Before Going Live:**

- Change default admin credentials
- Enable Firebase Firestore & Storage Rules
- Ensure API keys are restricted
- Test all routes with dummy data

---

## 🙋‍♂️ Support

For any issues, suggestions, or feedback, please open an issue on the [GitHub Issues](https://github.com/your-username/swipe-my-hood/issues) page.

---

Made with ❤️ in Bangalore 🇮🇳
