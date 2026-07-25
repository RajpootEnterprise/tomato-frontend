import './CategoryExplorer.css';

const CATEGORIES = [
  { name: 'Salad',     emoji: '🥗' },
  { name: 'Rolls',     emoji: '🌯' },
  { name: 'Deserts',   emoji: '🍮' },
  { name: 'Sandwich',  emoji: '🥪' },
  { name: 'Cake',      emoji: '🎂' },
  { name: 'Pure Veg',  emoji: '🥦' },
  { name: 'Pasta',     emoji: '🍝' },
  { name: 'Noodles',   emoji: '🍜' },
];

export default function CategoryExplorer({ selected, onSelect }) {
  return (
    <section className="category-section" aria-label="Browse by category">
      <div className="container">
        <div className="category-header">
          <h2 className="section-title">Explore Our Menu</h2>
          <p className="category-subtitle">Pick your favourite category and discover top dishes</p>
        </div>
        <div className="category-scroll">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              className={`category-card ${selected === cat.name ? 'active' : ''}`}
              onClick={() => onSelect(selected === cat.name ? null : cat.name)}
              aria-pressed={selected === cat.name}
              id={`category-${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="category-icon-wrap">
                <span className="category-emoji">{cat.emoji}</span>
              </div>
              <span className="category-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
