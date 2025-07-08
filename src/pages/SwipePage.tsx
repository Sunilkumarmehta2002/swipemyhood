import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Heart, X, MapPin, Star, DollarSign, Shield, TreePine, ShoppingCart, Bookmark, Eye, Calendar, Home, Users } from 'lucide-react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { neighborhoodData } from '../data/neighborhoods';
import toast from 'react-hot-toast';

interface SwipeCard {
  id: string;
  name: string;
  city: string;
  image: string;
  description: string;
  features: {
    safety: number;
    affordability: number;
    nightlife: number;
    greenSpaces: number;
    publicTransport: number;
    dining: number;
    shopping: number;
    community: number;
  };
  highlights: string[];
}

interface ServiceOption {
  id: string;
  type: 'consultation' | 'tour' | 'relocation_package';
  name: string;
  price: number;
  description: string;
  duration?: string;
  features: string[];
}

export function SwipePage() {
  const { currentUser } = useAuth();
  const { addToCart, saveForLater } = useCart();
  const [cards, setCards] = useState<SwipeCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showServices, setShowServices] = useState(false);
  const [selectedCard, setSelectedCard] = useState<SwipeCard | null>(null);
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const serviceOptions: ServiceOption[] = [
    {
      id: 'consultation',
      type: 'consultation',
      name: 'Neighborhood Consultation',
      price: 99,
      description: 'Get expert advice about this neighborhood from local real estate professionals',
      duration: '1 hour',
      features: [
        'Market analysis and trends',
        'School district information',
        'Local amenities overview',
        'Transportation options',
        'Future development plans'
      ]
    },
    {
      id: 'tour',
      type: 'tour',
      name: 'Guided Neighborhood Tour',
      price: 199,
      description: 'Experience the neighborhood firsthand with a local expert guide',
      duration: '3 hours',
      features: [
        'Walking tour of key areas',
        'Visit local hotspots',
        'Meet local business owners',
        'Transportation included',
        'Personalized recommendations'
      ]
    },
    {
      id: 'relocation_package',
      type: 'relocation_package',
      name: 'Complete Relocation Package',
      price: 499,
      description: 'Full-service relocation assistance for moving to this neighborhood',
      duration: '30 days support',
      features: [
        'Everything from consultation & tour',
        'Moving company recommendations',
        'Utility setup assistance',
        'Local service provider contacts',
        'Welcome package with local deals',
        '30-day support hotline'
      ]
    }
  ];

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setCards(neighborhoodData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading cards:', error);
      toast.error('Failed to load neighborhoods');
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!currentUser || currentIndex >= cards.length) return;

    const card = cards[currentIndex];
    const isLike = direction === 'right';

    try {
      await addDoc(collection(db, 'swipes'), {
        userId: currentUser.uid,
        neighborhoodId: card.id,
        isLike,
        timestamp: new Date(),
        neighborhoodData: card
      });

      if (isLike) {
        await addDoc(collection(db, 'matches'), {
          userId: currentUser.uid,
          neighborhoodId: card.id,
          score: calculateMatchScore(card),
          timestamp: new Date(),
          neighborhoodData: card
        });
        
        toast.success(`❤️ Added ${card.name} to your matches!`);
      }

      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error saving swipe:', error);
      toast.error('Failed to save your choice');
    }
  };

  const calculateMatchScore = (card: SwipeCard) => {
    const features = Object.values(card.features);
    const average = features.reduce((sum, val) => sum + val, 0) / features.length;
    return Math.round(average * 10);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.x > threshold) {
      handleSwipe('right');
    } else if (info.offset.x < -threshold) {
      handleSwipe('left');
    }
    
    x.set(0);
  };

  const handleButtonSwipe = (direction: 'left' | 'right') => {
    x.set(direction === 'right' ? 200 : -200);
    setTimeout(() => {
      handleSwipe(direction);
      x.set(0);
    }, 200);
  };

  const handleShowServices = (card: SwipeCard) => {
    setSelectedCard(card);
    setShowServices(true);
  };

  const handleAddToCart = (service: ServiceOption) => {
    if (!selectedCard) return;
    
    addToCart({
      id: `${selectedCard.id}-${service.id}`,
      name: `${service.name} - ${selectedCard.name}`,
      city: selectedCard.city,
      image: selectedCard.image,
      price: service.price,
      type: service.type,
      description: service.description
    });
    
    setShowServices(false);
  };

  const handleSaveForLater = () => {
    if (!selectedCard) return;
    
    saveForLater({
      id: selectedCard.id,
      name: selectedCard.name,
      city: selectedCard.city,
      image: selectedCard.image,
      description: selectedCard.description,
      savedAt: new Date()
    });
    
    setShowServices(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading neighborhoods...</p>
        </div>
      </div>
    );
  }

  if (currentIndex >= cards.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Heart size={64} className="mx-auto mb-6 text-pink-500" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Great job exploring!
          </h2>
          <p className="text-gray-600 mb-8">
            You've seen all the neighborhoods we have for now. Check back soon for more recommendations!
          </p>
          <div className="space-y-4">
            <button
              onClick={() => window.location.href = '/matches'}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              View My Matches
            </button>
            <button
              onClick={() => window.location.href = '/cart'}
              className="w-full bg-gradient-to-r from-blue-500 to-green-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              View Cart & Saved Items
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover & Shop Neighborhoods
          </h1>
          <p className="text-gray-600">
            Swipe right to like, left to pass, or explore services
          </p>
          <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
            <span className="text-sm font-medium text-gray-700">
              {currentIndex + 1} of {cards.length}
            </span>
          </div>
        </div>

        <div className="relative h-[700px] perspective-1000">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x, rotate, opacity }}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 bg-white rounded-2xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={currentCard.image}
                alt={currentCard.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-2xl font-bold mb-1">{currentCard.name}</h2>
                <p className="flex items-center space-x-1 text-white/90">
                  <MapPin size={16} />
                  <span>{currentCard.city}</span>
                </p>
              </div>
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => handleShowServices(currentCard)}
                  className="bg-white/90 backdrop-blur-sm text-gray-800 p-2 rounded-full hover:bg-white transition-all"
                >
                  <Eye size={20} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-6 leading-relaxed">
                {currentCard.description}
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield size={16} className="text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Safety</span>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < currentCard.features.safety ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign size={16} className="text-green-500" />
                    <span className="text-sm font-medium text-gray-700">Affordability</span>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < currentCard.features.affordability ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TreePine size={16} className="text-emerald-500" />
                    <span className="text-sm font-medium text-gray-700">Green Spaces</span>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < currentCard.features.greenSpaces ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {currentCard.highlights.map((highlight, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {highlight}
                  </span>
                ))}
              </div>

              {/* Service Preview */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                  <ShoppingCart size={16} />
                  <span>Available Services</span>
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Consultation from $99</p>
                  <p>• Guided Tour from $199</p>
                  <p>• Relocation Package from $499</p>
                </div>
                <button
                  onClick={() => handleShowServices(currentCard)}
                  className="mt-3 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                >
                  View All Services
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex justify-center items-center space-x-8 mt-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonSwipe('left')}
            className="bg-white text-red-500 p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <X size={32} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleShowServices(currentCard)}
            className="bg-white text-blue-500 p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <ShoppingCart size={32} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonSwipe('right')}
            className="bg-white text-pink-500 p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <Heart size={32} />
          </motion.button>
        </div>
      </div>

      {/* Services Modal */}
      {showServices && selectedCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCard.name} Services
                  </h2>
                  <p className="text-gray-600">{selectedCard.city}</p>
                </div>
                <button
                  onClick={() => setShowServices(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <button
                  onClick={handleSaveForLater}
                  className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Bookmark size={20} />
                  <span>Save for Later</span>
                </button>
              </div>

              <div className="space-y-6">
                {serviceOptions.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {service.type === 'consultation' && <Users size={20} className="text-blue-500" />}
                          {service.type === 'tour' && <Calendar size={20} className="text-green-500" />}
                          {service.type === 'relocation_package' && <Home size={20} className="text-purple-500" />}
                          <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                        {service.duration && (
                          <p className="text-sm text-blue-600 font-medium mb-3">Duration: {service.duration}</p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-2xl font-bold text-gray-900">${service.price}</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Includes:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleAddToCart(service)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                    >
                      <ShoppingCart size={20} />
                      <span>Add to Cart - ${service.price}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}