import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductApi, CartApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Products() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [addingToCart, setAddingToCart] = useState(null);

  const categories = ['All', 'Desert', 'Tower', 'Personal', 'Industrial', 'Window'];

  useEffect(() => {
    fetchProducts();
  }, [activeCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const filters = activeCategory !== 'All' ? { category: activeCategory } : {};
      const res = await ProductApi.getAll(filters);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    try {
      setAddingToCart(productId);
      await CartApi.addItem(productId, 1);
      setTimeout(() => setAddingToCart(null), 1000);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      setAddingToCart(null);
    }
  };

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative bg-surface-container-low overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.3em] text-primary uppercase mb-4">Atmospheric Precision</p>
              <h1 className="text-5xl md:text-6xl font-black text-on-surface leading-[1.05] tracking-tight mb-6">
                Engineered<br />for <span className="text-gradient">Silence</span>
              </h1>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8 max-w-md">
                Premium air coolers that disappear into your space. Whisper-quiet, architecturally minimal, devastatingly effective.
              </p>
              <div className="flex gap-3">
                <Link to="/" className="px-8 py-3.5 rounded-full btn-gradient text-on-primary font-semibold text-sm hover:opacity-90 transition-all">
                  Explore Technology
                </Link>
                <a href="#products" className="px-8 py-3.5 rounded-full bg-surface-container-highest text-on-surface font-semibold text-sm hover:bg-surface-dim transition-all">
                  Shop Now
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-surface-container rounded-3xl overflow-hidden ambient-shadow-lg">
                {products[0] && (
                  <img src={products[0].images[0]} alt={products[0].name} className="w-full h-full object-cover" />
                )}
              </div>
              {products[0] && (
                <div className="absolute -bottom-4 -left-4 bg-surface-container-lowest rounded-2xl p-4 ambient-shadow">
                  <p className="text-xs text-on-surface-variant">Starting at</p>
                  <p className="text-2xl font-bold text-on-surface">₹{products[0]?.price?.toLocaleString('en-IN')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section id="products" className="max-w-7xl mx-auto px-6 pt-16 pb-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-on-surface">Our Collection</h2>
            <p className="text-on-surface-variant mt-1">Precision-engineered cooling solutions</p>
          </div>
          <p className="text-sm text-on-surface-variant">{products.length} products</p>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'btn-gradient text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">inventory_2</span>
            <p className="text-on-surface-variant">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group bg-surface-container-lowest rounded-2xl overflow-hidden ambient-shadow hover:ambient-shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[4/3] bg-surface-container overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold tracking-[0.2em] text-primary uppercase">{product.category}</span>
                      <h3 className="text-lg font-bold text-on-surface mt-1">{product.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-on-surface">₹{product.price.toLocaleString('en-IN')}</p>
                      {product.mrp > product.price && (
                        <p className="text-xs text-on-surface-variant line-through">₹{product.mrp.toLocaleString('en-IN')}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-on-surface-variant mt-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-sm font-medium text-on-surface">{product.avgRating}</span>
                      <span className="text-xs text-on-surface-variant">({product.reviewCount})</span>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, product._id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container text-on-surface text-xs font-semibold hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
                    >
                      {addingToCart === product._id ? (
                        <>
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          Added!
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
