



import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';  // Make sure this import exists
import ProductDetail from './pages/ProductDetail';
import CartDrawer from './components/CartDrawer';


const App: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <CartProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col transition-colors duration-200 relative">
          <Navbar 
            onCartToggle={() => setIsCartOpen(true)} 
            isDark={isDark} 
            toggleTheme={() => setIsDark(!isDark)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home searchQuery={searchQuery} />} />
              <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
          </main>

          <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-primary-600">Rahman Shop</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
                    Curated selection of premium products with the fastest delivery and unmatched support.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold mb-4 text-slate-900 dark:text-slate-100">Quick Links</h4>
                  <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                    <li className="hover:text-primary-600 cursor-pointer transition-colors">Track Order</li>
                    <li className="hover:text-primary-600 cursor-pointer transition-colors">Privacy Policy</li>
                    <li className="hover:text-primary-600 cursor-pointer transition-colors">Terms of Service</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold mb-4 text-slate-900 dark:text-slate-100">Newsletter</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Subscribe for exclusive deals and updates.</p>
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      placeholder="Email address" 
                      className="bg-slate-100 dark:bg-slate-800 rounded-lg px-4 py-2 text-sm flex-1 outline-none border border-transparent focus:border-primary-600"
                    />
                    <button 
                      type="button"
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary-700 transition-all"
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
                © {new Date().getFullYear()} Rahman Shop. All rights reserved.
              </div>
            </div>
          </footer>

          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
         
        </div>
      </HashRouter>
    </CartProvider>
  );
};

export default App;