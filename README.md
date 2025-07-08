# 🏠 SwipeMyHood - Bangalore Neighborhood Discovery Platform

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7.1-orange.svg)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)

## 📋 Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Installation](#installation)
* [Configuration](#configuration)
* [Usage](#usage)
* [Admin Panel](#admin-panel)
* [Contributing](#contributing)
* [License](#license)

## 🌟 Overview

SwipeMyHood is an innovative neighborhood discovery platform specifically designed for Bangalore. It uses a swipe interface and ML algorithm to help users find neighborhoods based on lifestyle preferences.

## ✨ Features

* Swipe-based neighborhood discovery
* ML-powered personalized matching
* Service booking (consultation, tour, relocation)
* Dual auth system (user/admin)
* Admin dashboard for managing users, messages, data

## 🛠️ Tech Stack

**Frontend:** React, TypeScript, Tailwind CSS, Framer Motion, React Router DOM
**Backend:** Firebase (Auth, Firestore, Hosting, Functions)
**Dev Tools:** Vite, ESLint
**UI Tools:** Lucide React, React Hot Toast

## 🚀 Installation

```bash
git clone https://github.com/your-username/swipe-my-hood.git
cd swipe-my-hood
npm install
cp .env.example .env
npm run dev
```

## ⚙️ Configuration

Update Firebase credentials in `.env` and `src/lib/firebase.ts` with your project's config.

## 📖 Usage

### User Flow

* Sign up / login
* Complete onboarding with preferences
* Swipe neighborhoods
* Match, compare, and book services

### Admin Login

* URL: `/admin-login`
* Email: `admin@swipemyhood.in`
* Password: `admin123456`

## 🔒 SwipeMyHood Admin System Setup Guide

### 🚀 Quick Setup

#### Option A: In-Browser

1. Run `npm run dev`
2. Visit `http://localhost:5173`
3. Open browser console and run:

```javascript
setupAdmin()
```

#### Option B: Firebase Console

1. Create user in Firebase Auth:

   * Email: `admin@swipemyhood.in`
   * Password: `admin123456`
2. Firestore → `users` → Add doc with:

```json
{
  "email": "admin@swipemyhood.in",
  "name": "Admin User",
  "isAdmin": true,
  "createdAt": "<timestamp>",
  "lastActive": "<timestamp>"
}
```

### 📊 Admin Dashboard Features

* **Overview Tab:** Users, matches, messages, engagement metrics
* **Users Tab:** View/edit/delete users, admin badge
* **Messages Tab:** Contact form messages, status, reply
* **Settings Tab:** API config, algorithm weights, location data

### 📃 Contact Form

* Stores to `contact-messages`
* Admin replies tracked in `admin-replies`
* Status: new, replied, resolved

### 🛡️ Security

* Admin-only protected routes
* Firebase rules
* Audit trail for admin actions
* Session and input validation

## 🙏 Contributing

1. Fork and create a new branch
2. Make changes with proper commit message format
3. PR should pass lint, build, and test checks

## 📄 License

MIT License

---

**Default Admin Credentials:**

* Email: `admin@swipemyhood.in`
* Password: `admin123456`

🚨 **Change credentials in production!**
