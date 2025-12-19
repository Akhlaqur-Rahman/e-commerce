
import React from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full transform transition-transform">
          <div className="px-6 py-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag size={24} className="text-primary-600" />
              Your Cart
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-full mb-4">
                  <ShoppingBag size={48} />
                </div>
                <p className="text-lg font-medium">Your cart is empty</p>
                <button
                  onClick={onClose}
                  className="mt-4 text-primary-600 font-semibold hover:underline"
                >
                  Start shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between text-base font-medium text-slate-900 dark:text-slate-100">
                        <h3 className="line-clamp-1">{item.title}</h3>
                        <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <p className="mt-1 text-sm text-slate-500 capitalize">{item.category}</p>
                      
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-2 font-medium min-w-[2rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="px-6 py-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex justify-between text-base font-medium text-slate-900 dark:text-slate-100 mb-4">
                <p>Subtotal</p>
                <p className="text-xl font-bold">${cartTotal.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-sm text-slate-500 mb-6">Shipping and taxes calculated at checkout.</p>
              <div className="space-y-3">
                <button className="w-full bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20">
                  Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-red-500 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
