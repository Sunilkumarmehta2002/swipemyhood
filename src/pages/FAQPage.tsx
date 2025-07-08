import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs: FAQItem[] = [
    {
      category: 'Getting Started',
      question: 'How does SwipeMyHood India work?',
      answer: 'SwipeMyHood India uses a swipe-based interface where you swipe right on neighborhoods you like and left on ones you don\'t. Our AI learns your lifestyle preferences and suggests areas in Indian cities like Delhi, Mumbai, Bengaluru, and more.'
    },
    {
      category: 'Getting Started',
      question: 'Is SwipeMyHood India free to use?',
      answer: 'Yes! You can use all core features for free including swiping through neighborhoods, setting preferences, and viewing your matches. Premium plans will be introduced for real estate professionals and verified agents soon.'
    },
    {
      category: 'Getting Started',
      question: 'Do I need to create an account?',
      answer: 'Yes. A free account is required to save preferences and track swipes. You can sign up with your email or Google account. This helps us give better recommendations.'
    },
    {
      category: 'Matching & Algorithm',
      question: 'How accurate is the matching algorithm?',
      answer: 'Our matching engine uses data from local government sources, safety reports, real-time traffic and accessibility data, and user preferences to give reliable results. The more you interact, the smarter your matches get.'
    },
    {
      category: 'Matching & Algorithm',
      question: 'Can I change my lifestyle preferences later?',
      answer: 'Yes, anytime. Visit your profile settings to update your preferences like affordability, greenery, nightlife, etc. The system will instantly update your matches.'
    },
    {
      category: 'Matching & Algorithm',
      question: 'What factors affect my matches?',
      answer: 'We consider 8 factors: safety, affordability, nightlife, green spaces, transport, dining, shopping, and community vibe — all customized to Indian city layouts and behavior patterns.'
    },
    {
      category: 'Data & Privacy',
      question: 'Where does your neighborhood data come from?',
      answer: 'We use OpenStreetMap, government safety data, Google Maps APIs, Swachh Bharat city rankings, and local municipal reports. This helps ensure fresh and locally relevant data.'
    },
    {
      category: 'Data & Privacy',
      question: 'Is my data secure?',
      answer: 'Yes, we use Firebase with strong encryption standards. Your personal data is never sold or shared and is only used to improve your match accuracy.'
    },
    {
      category: 'Features',
      question: 'Can I swipe neighborhoods across multiple Indian cities?',
      answer: 'Absolutely! You can choose cities like Pune, Chennai, Noida, Hyderabad, etc. from your dashboard and explore different neighborhoods in each.'
    },
    {
      category: 'Features',
      question: 'Can I compare multiple areas before deciding?',
      answer: 'Yes. You can select up to 3 neighborhoods and compare them side-by-side by factors like cost of living, commute time, and cleanliness ratings.'
    },
    {
      category: 'Features',
      question: 'Can I see photos and Google Maps location?',
      answer: 'Yes. Each area card includes images, description, and a Google Maps link. Soon, we’ll add street view and metro map overlays.'
    },
    {
      category: 'Coverage',
      question: 'Which Indian cities are supported?',
      answer: 'We currently support 20+ Indian cities including Delhi, Mumbai, Jalandhar, Bengaluru, Hyderabad, and Jaipur. New cities are added based on requests and data availability.'
    },
    {
      category: 'Coverage',
      question: 'How do I request a new city?',
      answer: 'You can use the contact form to request your city. We prioritize based on demand and local data access. Tier-2 and Tier-3 cities are being added regularly.'
    },
    {
      category: 'Technical',
      question: 'Is there a mobile app available?',
      answer: 'Not yet. SwipeMyHood India is currently a responsive web app that works great on mobile. Android and iOS apps are under development.'
    },
    {
      category: 'Technical',
      question: 'Which browsers work best?',
      answer: 'We recommend Chrome, Firefox, or Safari for the smoothest experience. The app is fully optimized for mobile as well.'
    }
  ];

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <HelpCircle size={64} className="mx-auto mb-6 text-indigo-600" />
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Answers to your most common queries about SwipeMyHood India. Still confused? Reach out anytime!
          </p>
        </motion.div>

        {categories.map((category, categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4 px-4">
              {category}
            </h2>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-white/50 overflow-hidden">
              {faqs
                .filter(faq => faq.category === category)
                .map((faq, index) => {
                  const globalIndex = faqs.indexOf(faq);
                  const isOpen = openItems.includes(globalIndex);

                  return (
                    <div key={globalIndex} className="border-b border-gray-200 last:border-b-0">
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50/50 transition-colors focus:outline-none focus:bg-gray-50/50"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900 pr-4">
                            {faq.question}
                          </h3>
                          {isOpen ? (
                            <ChevronUp size={20} className="text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-500 flex-shrink-0" />
                          )}
                        </div>
                      </button>

                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-4"
                        >
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 border border-white/50">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Can’t find the answer you’re looking for? Our support team is happy to help.
            </p>
            <button
              onClick={() => window.location.href = '/contact'}
              className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
