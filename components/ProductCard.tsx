
import React from 'react';
import { Star, Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      <Link to={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white text-slate-900 p-3 rounded-full shadow-lg">
            <Eye size={20} />
          </div>
        </div>
        {product.discountPercentage > 10 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            {Math.round(product.discountPercentage)}% OFF
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <p className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">{product.category}</p>
          <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
            <Star size={12} fill="currentColor" />
            {product.rating}
          </div>
        </div>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="text-slate-900 dark:text-slate-100 font-bold text-sm mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50 dark:border-slate-700/50">
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900 dark:text-slate-100">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-[10px] text-slate-400 line-through">
                ₹{Math.round(product.price / (1 - product.discountPercentage / 100)).toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all shadow-md hover:shadow-primary-500/30 active:scale-95"
            aria-label="Add to cart"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
