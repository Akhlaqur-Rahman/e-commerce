
import React, { useState, useEffect, useMemo } from 'react';
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Product, ProductResponse, SortOption } from '../types';
import { API_BASE_URL, CATEGORIES, PRODUCTS_PER_PAGE } from '../constants';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/SkeletonLoader';

interface HomeProps {
  searchQuery: string;
}

const Home: React.FC<HomeProps> = ({ searchQuery }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  // Debounced Search and API calls
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${API_BASE_URL}/products?limit=100`; // Fetch many to filter client-side for better UX in this demo
        
        // Handle search case specifically if query is present
        if (searchQuery) {
          url = `${API_BASE_URL}/products/search?q=${searchQuery}&limit=100`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data: ProductResponse = await res.json();
        setProducts(data.products);
        setTotalProducts(data.products.length);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  // Client-side filtering and sorting for snappy UI
  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sortBy === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating-desc') result = [...result].sort((a, b) => b.rating - a.rating);

    return result;
  }, [products, selectedCategory, priceRange, sortBy]);

  const paginatedProducts = useMemo(() => {
    const start = currentPage * PRODUCTS_PER_PAGE;
    return filteredAndSortedProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(0); // Reset page on filter change
  }, [selectedCategory, sortBy, priceRange, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-slate-100">
              <Filter size={18} className="text-primary-600" />
              <h2 className="font-bold">Categories</h2>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                All Products
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors capitalize ${
                    selectedCategory === cat
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4 text-slate-900 dark:text-slate-100">
              <SlidersHorizontal size={18} className="text-primary-600" />
              <h2 className="font-bold">Price Range</h2>
            </div>
            <div className="space-y-4">
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>$0</span>
                <span>Max: ${priceRange[1]}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {selectedCategory === 'all' ? 'All Products' : selectedCategory.replace(/-/g, ' ')}
              </h1>
              <p className="text-slate-500 text-sm">{filteredAndSortedProducts.length} items found</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 outline-none transition-all"
              >
                <option value="default">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Top Rated</option>
              </select>
            </div>
          </div>

          {loading ? (
            <ProductGridSkeleton />
          ) : error ? (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
              <p className="text-red-500 font-medium mb-4">Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-primary-600 font-bold hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700">
              <div className="p-4 bg-slate-50 dark:bg-slate-700 rounded-full inline-block mb-4">
                <X size={32} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">No products found</h3>
              <p className="text-slate-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                          currentPage === i
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
