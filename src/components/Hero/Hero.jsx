import { useRef } from 'react';
import './Hero.css';

export default function Hero({ onExplore }) {
  const menuRef = useRef(null);

  return (
    <section className="hero" aria-label="Hero banner">
      {/* Background shapes */}
      <div className="hero-bg-circle hero-bg-circle-1" />
      <div className="hero-bg-circle hero-bg-circle-2" />
      <div className="hero-bg-circle hero-bg-circle-3" />

      <div className="container hero-inner">
        {/* Left: text */}
        <div className="hero-content">
          <div className="hero-tag">
            <span>🔥</span> Fresh & Delicious
          </div>
          <h1 className="hero-title">
            Order Your <br />
            <span className="hero-title-highlight">Favourite Food</span><br />
            Here
          </h1>
          <p className="hero-desc">
            Choose from hundreds of delicious meals prepared by top-rated restaurants,
            delivered fast right to your door.
          </p>
          <div className="hero-actions">
            <button className="btn-primary hero-cta" onClick={onExplore} id="hero-explore-btn">
              Explore Menu
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-num">1K+</span>
                <span className="stat-label">Dishes</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num">500+</span>
                <span className="stat-label">Orders</span>
              </div>
              <div className="stat-divider" />
              <div className="stat">
                <span className="stat-num">4.9★</span>
                <span className="stat-label">Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: image composition */}
        <div className="hero-image-wrap">
          <div className="hero-image-glow" />
          <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80"
            alt="Delicious food platter"
            className="hero-img"
            loading="eager"
          />
          {/* Floating card 1 */}
          <div className="hero-float hero-float-top">
            <span className="float-icon">⭐</span>
            <div>
              <p className="float-title">Top Rated</p>
              <p className="float-sub">Over 4.8 stars</p>
            </div>
          </div>
          {/* Floating card 2 */}
          <div className="hero-float hero-float-bottom">
            <span className="float-icon">⚡</span>
            <div>
              <p className="float-title">Fast Delivery</p>
              <p className="float-sub">Under 30 mins</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
