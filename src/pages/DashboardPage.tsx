import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Heart, BarChart3, Settings, RefreshCw } from 'lucide-react';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface UserStats {
  totalSwipes: number;
  totalLikes: number;
  totalMatches: number;
  topMatchScore: number;
}

export function DashboardPage() {
  const { currentUser, userData } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalSwipes: 0,
    totalLikes: 0,
    totalMatches: 0,
    topMatchScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [resettingPreferences, setResettingPreferences] = useState(false);

  useEffect(() => {
    loadUserStats();
  }, [currentUser]);

  const loadUserStats = async () => {
    if (!currentUser) return;

    try {
      // Get total swipes
      const swipesQuery = query(
        collection(db, 'swipes'),
        where('userId', '==', currentUser.uid)
      );
      const swipesSnapshot = await getDocs(swipesQuery);
      const totalSwipes = swipesSnapshot.size;
      const totalLikes = swipesSnapshot.docs.filter(doc => doc.data().isLike).length;

      // Get matches
      const matchesQuery = query(
        collection(db, 'matches'),
        where('userId', '==', currentUser.uid)
      );
      const matchesSnapshot = await getDocs(matchesQuery);
      const totalMatches = matchesSnapshot.size;
      
      // Get top match score
      const topMatchScore = matchesSnapshot.docs.reduce((max, doc) => {
        const score = doc.data().score || 0;
        return score > max ? score : max;
      }, 0);

      setStats({
        totalSwipes,
        totalLikes,
        totalMatches,
        topMatchScore
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetPreferences = async () => {
    if (!currentUser) return;

    try {
      setResettingPreferences(true);
      
      await setDoc(doc(db, 'users', currentUser.uid), {
        preferences: null,
        onboardingCompleted: false,
        updatedAt: new Date()
      }, { merge: true });

      toast.success('Preferences reset! Redirecting to onboarding...');
      setTimeout(() => {
        window.location.href = '/onboarding';
      }, 1000);
    } catch (error) {
      toast.error('Failed to reset preferences');
      console.error('Error resetting preferences:', error);
    } finally {
      setResettingPreferences(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {userData?.name || 'User'}!
            </h1>
            <p className="text-xl text-gray-600">
              Here's your neighborhood discovery journey so far
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/50"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalSwipes}</p>
                  <p className="text-gray-600 text-sm">Total Swipes</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/50"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-pink-500 to-red-600 text-white p-3 rounded-lg">
                  <Heart size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalLikes}</p>
                  <p className="text-gray-600 text-sm">Neighborhoods Liked</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/50"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 rounded-lg">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalMatches}</p>
                  <p className="text-gray-600 text-sm">Perfect Matches</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/50"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white p-3 rounded-lg">
                  <Settings size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.topMatchScore}%</p>
                  <p className="text-gray-600 text-sm">Best Match Score</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/50"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Continue Exploring</h3>
              <p className="text-gray-600 mb-6">
                Discover more neighborhoods that match your preferences
              </p>
              <button
                onClick={() => window.location.href = '/swipe'}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Start Swiping
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/50"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">View Matches</h3>
              <p className="text-gray-600 mb-6">
                Check out your perfect neighborhood matches and compare them
              </p>
              <button
                onClick={() => window.location.href = '/matches'}
                className="w-full bg-gradient-to-r from-pink-500 to-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                View Matches
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/50"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Reset Preferences</h3>
              <p className="text-gray-600 mb-6">
                Want to start fresh? Reset your preferences and retake the onboarding
              </p>
              <button
                onClick={resetPreferences}
                disabled={resettingPreferences}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <RefreshCw size={20} className={resettingPreferences ? 'animate-spin' : ''} />
                <span>{resettingPreferences ? 'Resetting...' : 'Reset Preferences'}</span>
              </button>
            </motion.div>
          </div>

          {/* Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/50"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">Account Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <p className="text-gray-900">{userData?.name || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{currentUser?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Member Since
                </label>
                <p className="text-gray-900">
                  {userData?.createdAt ? new Date(userData.createdAt.toDate()).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Onboarding Status
                </label>
                <p className="text-gray-900">
                  {userData?.onboardingCompleted ? 'Completed' : 'Incomplete'}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}