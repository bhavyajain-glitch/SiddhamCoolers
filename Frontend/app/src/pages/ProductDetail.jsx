import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductApi, CartApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await ProductApi.getById(id);
      setProduct(res.data);
    } catch (err) {
      console.error('Failed to fetch product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    try {
      setAddingToCart(true);
      await CartApi.addItem(product._id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error('Failed to add to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">error_outline</span>
          <p className="text-on-surface-variant">Product not found</p>
          <Link to="/" className="text-primary text-sm mt-4 inline-block hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const specs = product.specifications ? Object.entries(product.specifications instanceof Map ? Object.fromEntries(product.specifications) : product.specifications) : [];

  return (
    <main className="flex-1">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <span className="text-on-surface font-medium">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="aspect-square bg-surface-container rounded-3xl overflow-hidden ambient-shadow-lg mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden cursor-pointer transition-all ${
                      i === selectedImage ? 'ring-2 ring-primary' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <span className="text-xs font-semibold tracking-[0.3em] text-primary uppercase">{product.category}</span>
            <h1 className="text-4xl font-black text-on-surface mt-2 mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-lg text-amber-500" style={{ fontVariationSettings: `'FILL' ${i < Math.round(product.avgRating) ? 1 : 0}` }}>
                    star
                  </span>
                ))}
              </div>
              <span className="text-sm font-medium text-on-surface">{product.avgRating}</span>
              <span className="text-sm text-on-surface-variant">({product.reviewCount} reviews)</span>
            </div>

            {/* Pricing */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-on-surface">₹{product.price.toLocaleString('en-IN')}</span>
                {discount > 0 && (
                  <>
                    <span className="text-xl text-on-surface-variant line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">{discount}% OFF</span>
                  </>
                )}
              </div>
              <p className="text-xs text-on-surface-variant mt-2">Inclusive of all taxes • Free shipping</p>
            </div>

            {/* Description */}
            <p className="text-on-surface-variant leading-relaxed mb-8">{product.description}</p>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center bg-surface-container rounded-xl">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer">
                  <span className="material-symbols-outlined text-lg">remove</span>
                </button>
                <span className="w-10 text-center font-semibold text-on-surface">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer">
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stockQty === 0}
                className="flex-1 py-3.5 rounded-xl btn-gradient text-on-primary font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {added ? (
                  <><span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Added to Cart!</>
                ) : addingToCart ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : product.stockQty === 0 ? (
                  'Out of Stock'
                ) : (
                  <><span className="material-symbols-outlined text-lg">shopping_cart</span> Add to Cart</>
                )}
              </button>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm mb-8">
              <span className={`w-2 h-2 rounded-full ${product.stockQty > 10 ? 'bg-green-500' : product.stockQty > 0 ? 'bg-amber-500' : 'bg-error'}`}></span>
              <span className="text-on-surface-variant">
                {product.stockQty > 10 ? 'In Stock' : product.stockQty > 0 ? `Only ${product.stockQty} left` : 'Out of Stock'}
              </span>
            </div>

            {/* Specifications */}
            {specs.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-on-surface mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-2 gap-3">
                  {specs.map(([key, value]) => (
                    <div key={key} className="bg-surface-container-lowest rounded-xl p-4 ambient-shadow-sm">
                      <p className="text-[10px] font-semibold tracking-[0.2em] text-on-surface-variant uppercase">{key}</p>
                      <p className="text-lg font-bold text-on-surface mt-1">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
