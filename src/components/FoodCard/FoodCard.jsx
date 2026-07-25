import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import './FoodCard.css';

function StarRating({ rating = 0 }) {
  return (
    <div className="stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= Math.round(rating) ? 'star-filled' : 'star-empty'}>
          ★
        </span>
      ))}
      <span className="rating-num">{rating?.toFixed(1)}</span>
    </div>
  );
}

export default function FoodCard({ item, onLoginRequired, index = 0 }) {
  const { isLoggedIn } = useAuth();
  const { addItem, updateItem, getItemInCart } = useCart();
  const [adding, setAdding] = useState(false);

  const cartItem = getItemInCart(item.id);

  const handleAdd = async () => {
    if (!isLoggedIn) {
      onLoginRequired();
      return;
    }
    setAdding(true);
    try {
      await addItem(item.id);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add to cart';
      toast.error(msg);
    } finally {
      setAdding(false);
    }
  };

  const handleDecrement = async () => {
    if (!cartItem) return;
    const newQty = cartItem.quantity - 1;
    try {
      await updateItem(cartItem.id, newQty);
      if (newQty === 0) toast.success('Removed from cart');
    } catch (err) {
      toast.error('Failed to update cart');
    }
  };

  const handleIncrement = async () => {
    if (!cartItem) return;
    try {
      await updateItem(cartItem.id, cartItem.quantity + 1);
    } catch (err) {
      toast.error('Failed to update cart');
    }
  };

  return (
    <article 
      className="food-card animate-slide-up"
      style={{ animationDelay: `${(index % 12) * 0.06}s` }}
    >
      {/* Image */}
      <div className="food-card-img-wrap">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="food-card-img"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
          }}
        />
        {/* Category tag */}
        <span className="food-tag">{item.category}</span>
      </div>

      {/* Add/Stepper button */}
      <div className="food-add-wrap">
        {cartItem ? (
          <div className="stepper">
            <button
              className="stepper-btn"
              onClick={handleDecrement}
              aria-label="Decrease quantity"
              id={`decrement-${item.id}`}
            >
              −
            </button>
            <span className="stepper-qty">{cartItem.quantity}</span>
            <button
              className="stepper-btn"
              onClick={handleIncrement}
              aria-label="Increase quantity"
              id={`increment-${item.id}`}
            >
              +
            </button>
          </div>
        ) : (
          <button
            className="add-btn"
            onClick={handleAdd}
            disabled={adding}
            aria-label={`Add ${item.name} to cart`}
            id={`add-to-cart-${item.id}`}
          >
            {adding ? <span className="spinner-sm" style={{ borderColor: 'rgba(255,107,53,0.3)', borderTopColor: 'var(--primary)' }} /> : '+'}
          </button>
        )}
      </div>

      {/* Body */}
      <div className="food-card-body">
        <div className="food-card-top">
          <h3 className="food-name">{item.name}</h3>
          <StarRating rating={item.rating} />
        </div>
        <p className="food-desc">{item.description}</p>
        <p className="food-price">${item.price?.toFixed(2)}</p>
      </div>
    </article>
  );
}
