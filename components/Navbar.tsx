
import React from 'react';
import { ShoppingCart, Moon, Sun, Search, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  onCartToggle: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartToggle, isDark, toggleTheme, searchQuery, setSearchQuery }) => {
  const { cartCount } = useCart();

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="p-2 bg-primary-600 rounded-xl text-white">
              <Store size={24} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-sky-500 bg-clip-text text-transparent hidden sm:block">
              Rahman shop
            </span>
          </Link>

          <div className="flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-full leading-5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent sm:text-sm transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={22} /> : <Moon size={22} />}
            </button>

            <button
              onClick={onCartToggle}
              className="p-2 text-slate-500 hover:text-primary-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
