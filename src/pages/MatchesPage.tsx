import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Heart, ExternalLink } from 'lucide-react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface Match {
  id: string;
  neighborhoodId: string;
  score: number;
  timestamp: any;
  neighborhoodData: {
    name: string;
    city: string;
    image: string;
    description: string;
    features: Record<string, number>; // e.g. {safety: 4, transport: 5}
    highlights: string[]; // e.g. ['Park Nearby', 'Pet Friendly']
  };
}

export function MatchesPage() {
  const { currentUser } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatches, setSelectedMatches] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    if (currentUser) loadMatches();
  }, [currentUser]);

  // Fetch top 10 matches for the user
  const loadMatches = async () => {
    try {
      const q = query(
        collection(db, 'matches'),
        where('userId', '==', currentUser?.uid),
        orderBy('score', 'desc'),
        limit(10)
      );

      const querySnapshot = await getDocs(q);
      const matchesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Match[];

      setMatches(matchesData);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  // Select or deselect match for comparison
  const toggleSelection = (matchId: string) => {
    setSelectedMatches(prev =>
      prev.includes(matchId)
        ? prev.filter(id => id !== matchId)
        : prev.length < 3 ? [...prev, matchId] : prev
    );
  };

  const handleCompare = () => setShowComparison(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your matches...</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-center max-w-md p-8">
          <Heart size={64} className="mx-auto mb-6 text-gray-400" />
          <h2 className="text-3xl font-bold mb-4 text-gray-900">No matches yet</h2>
          <p className="mb-8 text-gray-600">Start swiping to find neighborhoods that fit your lifestyle.</p>
          <button
            onClick={() => window.location.href = '/swipe'}
            className="px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg transition"
          >
            Start Swiping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Your Neighborhood Matches</h1>
          <p className="text-xl text-gray-600 mb-6">These places align with your lifestyle preferences.</p>

          {selectedMatches.length > 0 && (
            <div className="inline-flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3">
              <span className="text-sm font-medium text-gray-700">{selectedMatches.length} selected</span>
              <button
                onClick={handleCompare}
                disabled={selectedMatches.length < 2}
                className="px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Compare
              </button>
              <button
                onClick={() => setSelectedMatches([])}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className={`cursor-pointer border-2 rounded-2xl shadow-lg overflow-hidden transition-all backdrop-blur-lg ${
                selectedMatches.includes(match.id)
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-white/50 hover:border-blue-200'
              } bg-white/80`}
              onClick={() => toggleSelection(match.id)}
            >
              <div className="relative h-48">
                <img src={match.neighborhoodData.image} alt={match.neighborhoodData.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 right-4 bg-white/90 rounded-full px-3 py-1">
                  <div className="flex items-center space-x-1">
                    <Star size={14} className="text-yellow-500 fill-current" />
                    <span className="text-sm font-bold text-gray-900">{match.score}%</span>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{match.neighborhoodData.name}</h3>
                  <p className="flex items-center space-x-1 text-white/90">
                    <MapPin size={14} />
                    <span className="text-sm">{match.neighborhoodData.city}</span>
                  </p>
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{match.neighborhoodData.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {match.neighborhoodData.highlights.slice(0, 3).map((highlight, i) => (
                    <span key={i} className="px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800">
                      {highlight}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Match Score</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" style={{ width: `${match.score}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{match.score}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Modal */}
        {showComparison && selectedMatches.length >= 2 && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Neighborhood Comparison</h2>
                <button onClick={() => setShowComparison(false)} className="text-gray-500 hover:text-gray-700">
                  <ExternalLink size={24} />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedMatches.map((matchId) => {
                  const match = matches.find((m) => m.id === matchId);
                  if (!match) return null;

                  return (
                    <div key={match.id} className="space-y-4">
                      <div className="relative h-32 rounded-lg overflow-hidden">
                        <img src={match.neighborhoodData.image} alt={match.neighborhoodData.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-2 left-2 text-white">
                          <h3 className="font-bold">{match.neighborhoodData.name}</h3>
                          <p className="text-xs text-white/90">{match.neighborhoodData.city}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {Object.entries(match.neighborhoodData.features).map(([feature, score]) => (
                          <div key={feature} className="flex items-center justify-between text-sm">
                            <span className="capitalize text-gray-600">{feature}</span>
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={i < score ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Match Score</span>
                          <span className="text-lg font-bold text-blue-600">{match.score}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
