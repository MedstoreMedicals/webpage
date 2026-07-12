import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faTag } from '@fortawesome/free-solid-svg-icons';
import { useCart } from '../context/CartContext';

interface Props {
  product: Product;
  view?: 'grid' | 'list';
}

const categoryIcons: Record<string, string> = {
  'Medical Accessories': '🎒',
  'Diagnostic Instruments': '🔨',
  'Stethoscope Accessories': '🩺',
  'Paediatric Accessories': '👶',
  'Clinical Examination Kits': '🔬',
};

const ProductCard: React.FC<Props> = ({ product, view = 'grid' }) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [needsVariant, setNeedsVariant] = useState(false);

  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const goToDetail = () => navigate(`/products/${product.id}`);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.variants.length > 0) {
      setNeedsVariant(true);
      return;
    }
    addItem(product);
  };

  const goSelectVariant = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToDetail();
  };

  const variantWarning = needsVariant && (
    <div style={{ color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 600, marginTop: 4 }}>
      Please{' '}
      <span style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={goSelectVariant}>
        select a {product.variants[0]?.color ? 'colour' : 'type/size'}
      </span>{' '}
      before adding to cart.
    </div>
  );

  if (view === 'list') {
    return (
      <div className="product-list-item" onClick={goToDetail} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && goToDetail()}>
        {product.images[0] ? (
          <img src={`${import.meta.env.BASE_URL.slice(0, -1)}${product.images[0]}`} alt={product.name} className="product-list-img" loading="lazy" />
        ) : (
          <div className="product-list-img-placeholder">
            {categoryIcons[product.category] || '🩺'}
          </div>
        )}
        <div style={{ flex: 1 }}>
          <div className="product-card-category">{product.category}</div>
          <h5 className="product-card-title">{product.name}</h5>
          <p className="product-card-desc" style={{ WebkitLineClamp: 3 }}>{product.description}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <span className="product-card-price">LKR {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="product-card-original-price">LKR {product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            {discountPct && (
              <span className="product-offer-badge">
                <FontAwesomeIcon icon={faTag} style={{ marginRight: 4 }} />
                {discountPct}% OFF
              </span>
            )}
            <span className={product.inStock ? 'stock-badge-in' : 'stock-badge-out'}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>
        <div style={{ alignSelf: 'center', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <button
            className="btn-primary-custom"
            onClick={handleAddToCart}
            disabled={!product.inStock}
            style={{ whiteSpace: 'nowrap', fontSize: '0.875rem', padding: '8px 16px' }}
          >
            <FontAwesomeIcon icon={faShoppingCart} style={{ marginRight: 6 }} />
            Add to Cart
          </button>
          {variantWarning}
        </div>
      </div>
    );
  }

  return (
    <div className="product-card" onClick={goToDetail} role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && goToDetail()}>
      {product.images[0] ? (
        <img src={`${import.meta.env.BASE_URL.slice(0, -1)}${product.images[0]}`} alt={product.name} className="product-card-img" loading="lazy" />
      ) : (
        <div className="product-card-img-placeholder">
          {categoryIcons[product.category] || '🩺'}
        </div>
      )}
      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>
        {discountPct && (
          <div className="product-offer-badge">
            <FontAwesomeIcon icon={faTag} style={{ marginRight: 4 }} />
            {discountPct}% OFF
          </div>
        )}
        <h5 className="product-card-title">{product.name}</h5>
        <p className="product-card-desc">{product.description}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <span className="product-card-price">LKR {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="product-card-original-price">LKR {product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <span className={product.inStock ? 'stock-badge-in' : 'stock-badge-out'}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <button
          className="btn-primary-custom"
          onClick={handleAddToCart}
          disabled={!product.inStock}
          style={{ marginTop: 12, width: '100%', fontSize: '0.875rem' }}
        >
          <FontAwesomeIcon icon={faShoppingCart} style={{ marginRight: 6 }} />
          Add to Cart
        </button>
        {variantWarning}
      </div>
    </div>
  );
};

export default ProductCard;
