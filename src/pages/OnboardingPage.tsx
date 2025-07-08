import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Shield, DollarSign, Zap, TreePine, Bus, Coffee, Building, Users } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface PreferenceSlider {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  value: number;
}

export function OnboardingPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [preferences, setPreferences] = useState<PreferenceSlider[]>([
    {
      id: 'safety',
      label: 'Safety',
      icon: Shield,
      description: 'How important is neighborhood safety?',
      value: 5
    },
    {
      id: 'affordability',
      label: 'Affordability',
      icon: DollarSign,
      description: 'Looking for budget-friendly options?',
      value: 5
    },
    {
      id: 'nightlife',
      label: 'Nightlife',
      icon: Zap,
      description: 'Want vibrant nightlife and entertainment?',
      value: 5
    },
    {
      id: 'greenSpaces',
      label: 'Green Spaces',
      icon: TreePine,
      description: 'Need parks and natural areas nearby?',
      value: 5
    },
    {
      id: 'publicTransport',
      label: 'Public Transport',
      icon: Bus,
      description: 'Important to have good transit access?',
      value: 5
    },
    {
      id: 'dining',
      label: 'Dining & Cafes',
      icon: Coffee,
      description: 'Love having restaurants and cafes nearby?',
      value: 5
    },
    {
      id: 'shopping',
      label: 'Shopping',
      icon: Building,
      description: 'Want easy access to shops and malls?',
      value: 5
    },
    {
      id: 'community',
      label: 'Community',
      icon: Users,
      description: 'Value strong community connections?',
      value: 5
    }
  ]);

  const updatePreference = (id: string, value: number) => {
    setPreferences(prev => 
      prev.map(pref => 
        pref.id === id ? { ...pref, value } : pref
      )
    );
  };

  const handleSubmit = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      
      const preferencesData = preferences.reduce((acc, pref) => ({
        ...acc,
        [pref.id]: pref.value
      }), {});

      await updateDoc(doc(db, 'users', currentUser.uid), {
        preferences: preferencesData,
        onboardingCompleted: true,
        updatedAt: new Date()
      });

      toast.success('Preferences saved! Ready to start swiping!');
      navigate('/swipe');
    } catch (error) {
      toast.error('Failed to save preferences. Please try again.');
      console.error('Error saving preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Tell us what matters to you
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help us find neighborhoods that perfectly match your lifestyle by setting your preferences below
          </p>
        </motion.div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/50">
          <div className="grid gap-8">
            {preferences.map((pref, index) => (
              <motion.div
                key={pref.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center space-x-6 p-6 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200"
              >
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg">
                  <pref.icon size={24} />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {pref.label}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {pref.description}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 min-w-0 flex-1 max-w-xs">
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    Not Important
                  </span>
                  <div className="flex-1">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={pref.value}
                      onChange={(e) => updatePreference(pref.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #6366f1 0%, #8b5cf6 ${pref.value * 10}%, #e5e7eb ${pref.value * 10}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    Very Important
                  </span>
                  <div className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium min-w-8 text-center">
                    {pref.value}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              <span>{loading ? 'Saving Preferences...' : 'Start Discovering'}</span>
              <ChevronRight 
                size={20} 
                className="group-hover:translate-x-1 transition-transform" 
              />
            </button>
            
            <p className="text-gray-500 text-sm mt-4">
              You can always update these preferences later in your dashboard
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}