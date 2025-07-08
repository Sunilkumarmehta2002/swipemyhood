import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Heart, Users, Zap } from 'lucide-react';

export function AboutPage() {
  const features = [
    {
      icon: Heart,
      title: 'Smart Matching',
      description: 'Our AI-powered algorithm learns your preferences to suggest neighborhoods that truly fit your lifestyle.'
    },
    {
      icon: MapPin,
      title: 'Real Data',
      description: 'We use verified data from trusted sources to provide accurate information about safety, amenities, and more.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Connect with locals and get insider tips about neighborhoods you\'re considering.'
    },
    {
      icon: Zap,
      title: 'Intuitive Experience',
      description: 'Swipe through neighborhoods as easily as browsing social media - finding your perfect home has never been simpler.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            About SwipeMyHood
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600 mb-8"
          >
            We're revolutionizing how people discover their perfect neighborhood through 
            intelligent matching and intuitive design.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Finding the perfect neighborhood shouldn't be overwhelming. We believe everyone 
                deserves to live in a community that matches their lifestyle, preferences, and dreams.
              </p>
              <p className="text-lg text-gray-600">
                SwipeMyHood combines cutting-edge technology with real-world data to make 
                neighborhood discovery as simple and enjoyable as swiping through your favorite app.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/50"
            >
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                  <div className="text-gray-600">Happy Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                  <div className="text-gray-600">Neighborhoods</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                  <div className="text-gray-600">Satisfaction Rate</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
                  <div className="text-gray-600">Cities Covered</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Makes Us Different
            </h2>
            <p className="text-xl text-gray-600">
              We're not just another real estate platform - we're your neighborhood discovery companion
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/50"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg w-fit mb-4">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Built by Neighborhood Enthusiasts
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Our team combines expertise in urban planning, data science, and user experience 
              to create the most intuitive neighborhood discovery platform.
            </p>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/50">
              <p className="text-gray-700 italic text-lg">
                "We believe that where you live shapes who you become. Our goal is to help 
                everyone find their perfect community - a place where they can thrive, connect, 
                and build the life they've always dreamed of."
              </p>
              <div className="mt-6">
                <p className="font-semibold text-gray-900">- The SwipeMyHood Team</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}