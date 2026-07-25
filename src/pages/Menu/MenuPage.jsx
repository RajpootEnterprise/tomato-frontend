import { useState, useEffect, useCallback } from 'react';
import CategoryExplorer from '../../components/CategoryExplorer/CategoryExplorer';
import FoodCard from '../../components/FoodCard/FoodCard';
import { getMenu } from '../../api/menu';
import './MenuPage.css';

export default function MenuPage({ onLoginRequired }) {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [slowLoad, setSlowLoad] = useState(false);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async (category) => {
    setLoading(true);
    setError(null);
    const slowTimer = setTimeout(() => setSlowLoad(true), 3000);
    try {
      const res = await getMenu(category);
      const body = res.data;
      if (body.success) {
        setItems(body.data ?? []);
        setFiltered(body.data ?? []);
      } else {
        setError(body.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load menu');
    } finally {
      clearTimeout(slowTimer);
      setSlowLoad(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(selectedCategory);
  }, [selectedCategory, fetchItems]);

  // Client-side search filter
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(items);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      items.filter(
        (i) =>
          i.name?.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.category?.toLowerCase().includes(q)
      )
    );
  }, [search, items]);

  return (
    <main className="menu-page">
      {/* Page header */}
      <div className="menu-page-header">
        <div className="container">
          <h1 className="menu-page-title">Our Full Menu</h1>
          <p className="menu-page-sub">Explore all our delicious dishes</p>
          {/* Search bar */}
          <div className="menu-search-wrap">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              placeholder="Search dishes, categories…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="menu-search"
              id="menu-search-input"
              aria-label="Search menu"
            />
            {search && (
              <button
                className="search-clear"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      <CategoryExplorer selected={selectedCategory} onSelect={(c) => { setSelectedCategory(c); setSearch(''); }} />

      <section className="menu-dishes" aria-label="Dishes">
        <div className="container">
          <div className="menu-dishes-meta">
            <p className="results-count">
              {loading ? '' : `${filtered.length} dish${filtered.length !== 1 ? 'es' : ''} found`}
            </p>
          </div>

          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              {slowLoad && (
                <p className="slow-load-msg">⏳ Waking up the server, this can take up to a minute…</p>
              )}
            </div>
          )}

          {!loading && error && (
            <div className="error-state">
              <span className="error-icon">🍽️</span>
              <p>{error}</p>
              <button className="btn-primary" onClick={() => fetchItems(selectedCategory)}>Retry</button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <p>No dishes match your search.</p>
              <button className="btn-outline" onClick={() => { setSearch(''); setSelectedCategory(null); }}>
                Reset filters
              </button>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="dishes-grid">
              {filtered.map((item, index) => (
                <FoodCard key={item.id} item={item} onLoginRequired={onLoginRequired} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
