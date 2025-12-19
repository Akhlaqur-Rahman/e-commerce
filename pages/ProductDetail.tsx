
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, ShoppingCart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { Product } from '../types';
import { API_BASE_URL } from '../constants';
import { useCart } from '../context/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!res.ok) throw new Error('Product not found');
        const data: Product = await res.json();
        setProduct(data);
        setActiveImage(data.thumbnail);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-3xl"></div>
          <div className="space-y-6">
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
        <p className="text-slate-500 mb-8">{error || 'Product could not be loaded'}</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const originalPrice = (product.price / (1 - product.discountPercentage / 100)).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 hover:text-primary-600 mb-8 transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-contain p-8"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {[product.thumbnail, ...product.images.slice(0, 4)].map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={`flex-shrink-0 w-24 h-24 rounded-xl border-2 transition-all overflow-hidden bg-white dark:bg-slate-800 ${
                  activeImage === img ? 'border-primary-600' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`${product.title} view ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-primary-50 dark:bg-primary-900/30 text-primary-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star size={18} fill="currentColor" />
                {product.rating}
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 mb-4 leading-tight">
              {product.title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-end gap-3 mb-2">
              <span className="text-4xl font-black text-slate-900 dark:text-slate-100">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="text-xl text-slate-400 line-through mb-1">
                    ₹{Math.round(Number(originalPrice)).toLocaleString('en-IN')}
                  </span>
                  <span className="text-red-500 font-bold mb-1">
                    {Math.round(product.discountPercentage)}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-sm text-slate-500 font-medium">In Stock: {product.stock} units left</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><Truck size={20} /></div>
              <span className="text-xs font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><ShieldCheck size={20} /></div>
              <span className="text-xs font-medium">Genuine Product</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
              <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"><RefreshCw size={20} /></div>
              <span className="text-xs font-medium">30 Day Return</span>
            </div>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-primary-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 active:scale-95"
          >
            <ShoppingCart size={24} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
