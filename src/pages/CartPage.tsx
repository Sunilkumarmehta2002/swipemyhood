import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, Bookmark, CreditCard, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export function CartPage() {
  const { state, removeFromCart, updateQuantity, removeSaved } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (state.items.length > 0) {
      navigate('/checkout');
    }
  };

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
              Your Cart & Saved Items
            </h1>
            <p className="text-xl text-gray-600">
              Review your neighborhood services and saved locations
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/50 mb-8">
                <div className="flex items-center space-x-2 mb-6">
                  <ShoppingCart size={24} className="text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Cart ({state.itemCount} items)
                  </h2>
                </div>

                {state.items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart size={64} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-600 mb-6">Start exploring neighborhoods to add services to your cart</p>
                    <button
                      onClick={() => navigate('/swipe')}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {state.items.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.city}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">${item.price * item.quantity}</div>
                          <div className="text-sm text-gray-500">${item.price} each</div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Saved Items */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/50">
                <div className="flex items-center space-x-2 mb-6">
                  <Bookmark size={24} className="text-yellow-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Saved for Later ({state.savedItems.length})
                  </h2>
                </div>

                {state.savedItems.length === 0 ? (
                  <div className="text-center py-8">
                    <Bookmark size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600">No saved neighborhoods yet</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {state.savedItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative bg-gray-50 rounded-lg overflow-hidden"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-32 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{item.city}</p>
                          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate('/swipe')}
                              className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-blue-600 transition-colors"
                            >
                              View Services
                            </button>
                            <button
                              onClick={() => removeSaved(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-white/50 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${state.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service Fee</span>
                    <span className="font-medium">${Math.round(state.total * 0.05)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${Math.round(state.total * 0.08)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${Math.round(state.total * 1.13)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={state.items.length === 0}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 px-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <CreditCard size={20} />
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={20} />
                </button>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate('/swipe')}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    Continue Shopping
                  </button>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Secure Checkout</h3>
                  <p className="text-sm text-green-700">
                    Your payment information is encrypted and secure. We accept all major credit cards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}