import { useState, useEffect, useCallback } from 'react';
import Hero from '../../components/Hero/Hero';
import CategoryExplorer from '../../components/CategoryExplorer/CategoryExplorer';
import FoodCard from '../../components/FoodCard/FoodCard';
import { getMenu } from '../../api/menu';
import './HomePage.css';

export default function HomePage({ onLoginRequired }) {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slowLoad, setSlowLoad] = useState(false);
  const [error, setError] = useState(null);

  const menuSectionRef = useCallback((node) => {
    if (node) {
      window._menuSectionEl = node;
    }
  }, []);

  const scrollToMenu = () => {
    window._menuSectionEl?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchItems = useCallback(async (category) => {
    setLoading(true);
    setError(null);

    // Show "waking up" message after 3 seconds
    const slowTimer = setTimeout(() => setSlowLoad(true), 3000);

    try {
      const res = await getMenu(category);
      const body = res.data;
      if (body.success) {
        setItems(body.data ?? []);
      } else {
        setError(body.message);
      }
    } catch (err) {
      const msg =
        err.code === 'ECONNABORTED'
          ? 'Server took too long to respond. Please refresh.'
          : err.response?.data?.message || 'Failed to load menu';
      setError(msg);
    } finally {
      clearTimeout(slowTimer);
      setSlowLoad(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(selectedCategory);
  }, [selectedCategory, fetchItems]);

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
  };

  return (
    <main>
      <Hero onExplore={scrollToMenu} />

      <CategoryExplorer
        selected={selectedCategory}
        onSelect={handleCategorySelect}
      />

      {/* Dishes grid */}
      <section className="dishes-section" ref={menuSectionRef} id="menu-section">
        <div className="container">
          <div className="dishes-header">
            <h2 className="section-title">
              {selectedCategory ? `${selectedCategory} Dishes` : 'Top Dishes Near You'}
            </h2>
            {selectedCategory && (
              <button
                className="clear-filter"
                onClick={() => setSelectedCategory(null)}
              >
                ✕ Clear filter
              </button>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              {slowLoad && (
                <p className="slow-load-msg">
                  ⏳ Waking up the server, this can take up to a minute…
                </p>
              )}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="error-state">
              <span className="error-icon">🍽️</span>
              <p>{error}</p>
              <button className="btn-primary" onClick={() => fetchItems(selectedCategory)}>
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && items.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">🤷</span>
              <p>No dishes found{selectedCategory ? ` in "${selectedCategory}"` : ''}.</p>
              {selectedCategory && (
                <button className="btn-outline" onClick={() => setSelectedCategory(null)}>
                  Show all dishes
                </button>
              )}
            </div>
          )}

          {/* Dish grid */}
          {!loading && !error && items.length > 0 && (
            <div className="dishes-grid">
              {items.map((item, index) => (
                <FoodCard
                  key={item.id}
                  item={item}
                  onLoginRequired={onLoginRequired}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
