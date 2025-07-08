# 🏠 SwipeMyHood - Bangalore Neighborhood Discovery Platform

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7.1-orange.svg)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-646CFF.svg)](https://vitejs.dev/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Admin Panel](#admin-panel)
- [ML Matching Algorithm](#ml-matching-algorithm)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

SwipeMyHood is an innovative neighborhood discovery platform specifically designed for Bangalore, India. Using a Tinder-like swipe interface combined with advanced ML algorithms, it helps users find their perfect neighborhood based on their lifestyle preferences and requirements.

### 🎯 Key Objectives

- **Simplify neighborhood discovery** through intuitive swipe-based interface
- **Provide data-driven insights** about Bangalore neighborhoods
- **Enable service booking** for neighborhood exploration and relocation
- **Offer comprehensive admin management** for platform oversight

## ✨ Features

### 🔥 Core Features

- **🔄 Swipe-based Discovery**: Tinder-like interface for neighborhood exploration
- **🤖 ML-Powered Matching**: Advanced algorithm for personalized recommendations
- **🛒 Service Marketplace**: Book consultations, tours, and relocation packages
- **📊 Detailed Analytics**: Comprehensive neighborhood data and insights
- **🔐 Dual Authentication**: Separate user and admin authentication systems
- **📱 Responsive Design**: Optimized for all devices and screen sizes

### 👤 User Features

- **Personalized Onboarding**: Set preferences for 8 key lifestyle factors
- **Smart Matching**: AI-powered neighborhood recommendations
- **Interactive Cards**: Rich neighborhood information with photos and highlights
- **Match Management**: Save, compare, and manage favorite neighborhoods
- **Service Booking**: Purchase consultation, tour, and relocation services
- **Shopping Cart**: Full e-commerce functionality with secure checkout

### 🛡️ Admin Features

- **User Management**: Complete CRUD operations for user accounts
- **Message Center**: Handle contact form submissions and user inquiries
- **Algorithm Control**: Configure ML matching parameters and weights
- **Analytics Dashboard**: Monitor platform usage and performance metrics
- **Content Management**: Update neighborhood data and service offerings

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library with hooks
- **TypeScript 5.5.3** - Type-safe JavaScript development
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Framer Motion 10.16.5** - Smooth animations and transitions
- **React Router DOM 6.20.1** - Client-side routing
- **React Hook Form 7.48.2** - Efficient form handling

### Backend & Database
- **Firebase 10.7.1** - Backend-as-a-Service platform
  - **Authentication** - User and admin authentication
  - **Firestore** - NoSQL document database
  - **Functions** - Serverless backend logic
  - **Hosting** - Static site hosting

### Development Tools
- **Vite 5.4.2** - Fast build tool and dev server
- **ESLint** - Code linting and quality assurance
- **PostCSS** - CSS processing and optimization

### UI Components & Icons
- **Lucide React 0.344.0** - Beautiful, customizable icons
- **React Hot Toast 2.4.1** - Elegant toast notifications

## 📁 Project Structure

```
swipe-my-hood/
├── public/                     # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── AdminProtectedRoute.tsx
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/              # React context providers
│   │   ├── AdminAuthContext.tsx
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── data/                  # Static data and configurations
│   │   └── neighborhoods.ts
│   ├── lib/                   # External service configurations
│   │   └── firebase.ts
│   ├── pages/                 # Page components
│   │   ├── AboutPage.tsx
│   │   ├── AdminLoginPage.tsx
│   │   ├── AdminPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── ContactPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── FAQPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── MatchesPage.tsx
│   │   ├── OnboardingPage.tsx
│   │   ├── SignupPage.tsx
│   │   └── SwipePage.tsx
│   ├── utils/                 # Utility functions
│   │   └── mlMatching.ts
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build configuration
└── README.md                # Project documentation
```

## 🚀 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Firebase account** with project setup

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/swipe-my-hood.git
   cd swipe-my-hood
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, and Functions
   - Copy your Firebase configuration

4. **Set up environment variables**
   ```bash
   # Create .env file in root directory
   cp .env.example .env
   ```

5. **Update Firebase configuration**
   - Edit `src/lib/firebase.ts` with your Firebase config
   - Ensure all Firebase services are properly initialized

6. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. **Access the application**
   - Open [http://localhost:5173](http://localhost:5173) in your browser

## ⚙️ Configuration

### Firebase Setup

1. **Authentication Configuration**
   ```javascript
   // Enable Email/Password and Google authentication
   // Configure authorized domains for production
   ```

2. **Firestore Database Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read/write their own data
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Swipes and matches are user-specific
       match /swipes/{swipeId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
       
       match /matches/{matchId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
       }
       
       // Contact messages are write-only for users
       match /contact-messages/{messageId} {
         allow create: if request.auth != null;
         allow read, update, delete: if request.auth != null && 
           get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
       }
     }
   }
   ```

3. **Required Firestore Indexes**
   ```javascript
   // Composite indexes needed for queries
   Collection: matches
   Fields: userId (Ascending), score (Descending)
   
   Collection: swipes  
   Fields: userId (Ascending), timestamp (Descending)
   
   Collection: contact-messages
   Fields: status (Ascending), timestamp (Descending)
   ```

### Environment Variables

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional: Analytics
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 📖 Usage

### For Regular Users

1. **Sign Up / Login**
   - Create account with email/password or Google
   - Complete onboarding questionnaire

2. **Set Preferences**
   - Rate importance of 8 lifestyle factors (1-10 scale):
     - Safety, Affordability, Nightlife, Green Spaces
     - Public Transport, Dining, Shopping, Community

3. **Discover Neighborhoods**
   - Swipe right (❤️) to like neighborhoods
   - Swipe left (❌) to pass
   - Tap shopping cart (🛒) to view services

4. **Manage Matches**
   - View all liked neighborhoods
   - Compare up to 3 neighborhoods side-by-side
   - Access detailed neighborhood information

5. **Book Services**
   - Consultation ($99) - Expert neighborhood advice
   - Guided Tour ($199) - 3-hour neighborhood exploration
   - Relocation Package ($499) - Complete moving assistance

### For Administrators

1. **Admin Access**
   - Navigate to `/admin/login`
   - Use credentials: `hood123@gmail.com` / `123456789`

2. **User Management**
   - View all registered users
   - Edit user status and permissions
   - Monitor user activity and preferences

3. **Message Management**
   - Review contact form submissions
   - Respond to user inquiries
   - Track message status and resolution

4. **Algorithm Configuration**
   - Adjust ML matching weights
   - Configure location bias settings
   - Update algorithm parameters

## 🛡️ Admin Panel

### Access Credentials
- **Email**: `hood123@gmail.com`
- **Password**: `123456789`

### Admin Features

#### 📊 Dashboard Overview
- **User Statistics**: Total users, active users, new registrations
- **Platform Metrics**: Total swipes, matches, conversion rates
- **Revenue Analytics**: Service bookings, revenue trends
- **System Health**: Performance metrics, error rates

#### 👥 User Management
```typescript
// User CRUD Operations
interface UserManagement {
  viewUsers: () => User[];           // List all users
  editUser: (id: string) => void;    // Edit user details
  deleteUser: (id: string) => void;  // Remove user account
  toggleStatus: (id: string) => void; // Activate/deactivate
  updateRole: (id: string, role: 'user' | 'admin') => void;
}
```

#### 📧 Message Center
- **Inbox Management**: View all contact messages
- **Status Tracking**: New, Read, Replied, Resolved
- **Response System**: Direct email integration
- **Search & Filter**: Find messages by date, status, user

#### 🤖 ML Algorithm Control
```typescript
// Algorithm Configuration Interface
interface AlgorithmConfig {
  weights: {
    safety: number;        // 0.0 - 1.0
    affordability: number; // 0.0 - 1.0
    nightlife: number;     // 0.0 - 1.0
    greenSpaces: number;   // 0.0 - 1.0
    publicTransport: number; // 0.0 - 1.0
    dining: number;        // 0.0 - 1.0
    shopping: number;      // 0.0 - 1.0
    community: number;     // 0.0 - 1.0
  };
  locationBias: number;    // Bangalore-specific location importance
  popularityWeight: number; // Community popularity factor
  demographicWeight: number; // User demographic matching
}
```

## 🤖 ML Matching Algorithm

### Algorithm Overview

The ML matching system uses a sophisticated multi-factor approach optimized for Bangalore's unique characteristics:

#### 🧮 Core Components

1. **Preference Matching (60% weight)**
   - Cosine similarity between user preferences and neighborhood features
   - Gaussian similarity function for nuanced matching
   - Weighted scoring based on user-defined importance

2. **Location Scoring (25% weight)**
   - Proximity to key Bangalore locations:
     - MG Road (Business District) - 30% weight
     - Electronic City (IT Hub) - 25% weight  
     - Whitefield (IT Corridor) - 20% weight
     - Airport (Connectivity) - 15% weight
     - Cultural Centers - 10% weight

3. **Popularity Bonus (10% weight)**
   - Community-driven popularity scores
   - Real user feedback integration
   - Trending neighborhood detection

4. **Demographic Matching (15% weight)**
   - Age group compatibility
   - Family-friendliness alignment
   - Professional density matching

#### 🔧 Algorithm Configuration

```typescript
// Default Bangalore-optimized settings
const defaultConfig = {
  weights: {
    safety: 0.15,        // High priority for safety
    affordability: 0.12, // Important for cost-conscious users
    nightlife: 0.10,     // Moderate importance
    greenSpaces: 0.13,   // Important for quality of life
    publicTransport: 0.15, // Critical in Bangalore
    dining: 0.12,        // Food culture importance
    shopping: 0.10,      // Convenience factor
    community: 0.13      // Social connections
  },
  locationBias: 0.25,    // 25% weight for location
  popularityWeight: 0.10, // 10% community popularity
  demographicWeight: 0.15 // 15% demographic matching
};
```

#### 📈 Matching Process

1. **Data Preprocessing**
   - Normalize user preferences (1-10 scale → 0-1)
   - Normalize neighborhood features (1-5 scale → 0-1)
   - Calculate location distances using Haversine formula

2. **Score Calculation**
   ```typescript
   totalScore = (
     preferenceMatch * 0.60 +
     locationScore * locationBias +
     popularityBonus * popularityWeight +
     demographicMatch * demographicWeight
   );
   ```

3. **Confidence Assessment**
   - Based on preference variance and data quality
   - Higher confidence for well-defined preferences
   - Accounts for data completeness

4. **Result Ranking**
   - Sort by total score (descending)
   - Apply minimum threshold (60%)
   - Limit to top 5 matches for optimal user experience

## 🌐 API Documentation

### Authentication Endpoints

#### User Authentication
```typescript
// Sign up new user
POST /auth/signup
Body: { email: string, password: string, name: string }

// User login
POST /auth/login  
Body: { email: string, password: string }

// Google OAuth
POST /auth/google
Body: { googleToken: string }
```

#### Admin Authentication
```typescript
// Admin login (hardcoded credentials)
POST /admin/auth/login
Body: { email: "hood123@gmail.com", password: "123456789" }
```

### User Endpoints

#### Profile Management
```typescript
// Get user profile
GET /api/users/:userId
Headers: { Authorization: "Bearer <token>" }

// Update user preferences
PUT /api/users/:userId/preferences
Body: { preferences: UserPreferences }

// Update user profile
PUT /api/users/:userId
Body: { name?: string, email?: string }
```

#### Neighborhood Discovery
```typescript
// Get neighborhood recommendations
GET /api/neighborhoods/recommendations
Headers: { Authorization: "Bearer <token>" }
Query: { limit?: number, offset?: number }

// Record swipe action
POST /api/swipes
Body: { neighborhoodId: string, isLike: boolean }

// Get user matches
GET /api/matches
Headers: { Authorization: "Bearer <token>" }
```

#### Service Booking
```typescript
// Add item to cart
POST /api/cart/items
Body: { serviceId: string, neighborhoodId: string }

// Get cart contents
GET /api/cart
Headers: { Authorization: "Bearer <token>" }

// Process checkout
POST /api/checkout
Body: { items: CartItem[], paymentInfo: PaymentDetails }
```

### Admin Endpoints

#### User Management
```typescript
// Get all users (admin only)
GET /admin/users
Headers: { Authorization: "Bearer <admin-token>" }

// Update user status
PUT /admin/users/:userId/status
Body: { status: 'active' | 'inactive' }

// Delete user
DELETE /admin/users/:userId
```

#### Message Management
```typescript
// Get contact messages
GET /admin/messages
Query: { status?: string, limit?: number }

// Update message status
PUT /admin/messages/:messageId
Body: { status: 'new' | 'read' | 'replied' | 'resolved' }
```

#### Algorithm Configuration
```typescript
// Get current algorithm config
GET /admin/algorithm/config

// Update algorithm parameters
PUT /admin/algorithm/config
Body: { weights: AlgorithmWeights, locationBias: number }
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
src/
├── __tests__/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   └── utils/
├── __mocks__/
│   ├── firebase.ts
│   └── framer-motion.ts
└── setupTests.ts
```

### Testing Guidelines

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows
- **Mock External Services**: Firebase, payment processing

## 🚀 Deployment

### Production Build

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Firebase Deployment

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init

# Deploy to Firebase Hosting
firebase deploy
```

### Environment Setup

#### Development
```bash
# Local development with hot reload
npm run dev
```

#### Staging
```bash
# Deploy to staging environment
firebase deploy --only hosting:staging
```

#### Production
```bash
# Deploy to production
firebase deploy --only hosting:production
```

## 🔧 Troubleshooting

### Common Issues

#### Firebase Connection Issues
```bash
# Check Firebase configuration
npm run firebase:check

# Verify environment variables
npm run env:verify
```

#### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
npm run dev -- --force
```

#### Authentication Problems
```bash
# Verify Firebase Auth configuration
# Check authorized domains in Firebase Console
# Ensure proper redirect URLs are configured
```

### Performance Optimization

#### Bundle Size Analysis
```bash
# Analyze bundle size
npm run build:analyze

# Check for unused dependencies
npm run deps:check
```

#### Image Optimization
- Use WebP format for better compression
- Implement lazy loading for neighborhood images
- Optimize image sizes for different screen resolutions

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make changes and commit**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open Pull Request**

### Code Standards

#### TypeScript Guidelines
- Use strict type checking
- Define interfaces for all data structures
- Avoid `any` type usage
- Use proper error handling

#### React Best Practices
- Use functional components with hooks
- Implement proper error boundaries
- Follow component composition patterns
- Use React.memo for performance optimization

#### CSS/Styling Guidelines
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use CSS custom properties for theming

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

**Types**: feat, fix, docs, style, refactor, test, chore

**Examples**:
```
feat(auth): add Google OAuth integration
fix(swipe): resolve card animation glitch
docs(readme): update installation instructions
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Firebase Team** for comprehensive backend services
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **Lucide React** for beautiful icons
- **Bangalore Community** for neighborhood insights

## 📞 Support

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs via GitHub Issues
- **Discussions**: Join community discussions
- **Email**: Contact admin at hood123@gmail.com

### Reporting Issues

When reporting issues, please include:
- **Environment details** (OS, Node.js version, browser)
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Screenshots or error logs** if applicable

---

**Made with ❤️ for Bangalore** | **SwipeMyHood Team** | **2024**