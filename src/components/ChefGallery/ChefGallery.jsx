import { useState } from 'react';
import SpotlightCard from '../SpotlightCard/SpotlightCard';
import './ChefGallery.css';

const GALLERY_ITEMS = [
  {
    id: 1,
    name: 'Truffle Glazed Burger',
    category: 'Gourmet Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    description: 'A premium Wagyu beef patty glazed with black truffle oil, topped with aged white cheddar, caramelized onions, and wild arugula on a toasted brioche bun.',
    prepTime: '20 mins',
    rating: 4.9,
    ingredients: ['Wagyu Beef', 'Black Truffle Glaze', 'Aged Cheddar', 'Caramelized Onions', 'Brioche Bun', 'Arugula']
  },
  {
    id: 2,
    name: 'Mediterranean Harvest Salad',
    category: 'Healthy Greens',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
    description: 'A vibrant mix of organic field greens, heirloom cherry tomatoes, kalamata olives, crisp cucumbers, pickled red onions, and imported French feta, tossed in herb-infused vinaigrette.',
    prepTime: '12 mins',
    rating: 4.8,
    ingredients: ['Field Greens', 'Cherry Tomatoes', 'Kalamata Olives', 'Cucumbers', 'Feta Cheese', 'Herb Vinaigrette']
  },
  {
    id: 3,
    name: 'Artisan Neapolitan Pizza',
    category: 'Woodfired Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    description: 'Slow-fermented sourdough crust topped with San Marzano tomato sauce, fresh buffalo mozzarella, hand-torn basil leaves, and a drizzle of extra virgin olive oil.',
    prepTime: '15 mins',
    rating: 5.0,
    ingredients: ['Sourdough Crust', 'San Marzano Sauce', 'Buffalo Mozzarella', 'Fresh Basil', 'Olive Oil']
  },
  {
    id: 4,
    name: 'Spicy Salmon Sushi Roll',
    category: 'Sushi & Rolls',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80',
    description: 'Fresh Atlantic salmon, creamy avocado, and cucumber rolled in seasoned sushi rice and nori, topped with spicy sriracha aioli, toasted sesame seeds, and microgreens.',
    prepTime: '18 mins',
    rating: 4.9,
    ingredients: ['Atlantic Salmon', 'Sushi Rice', 'Avocado', 'Cucumber', 'Nori', 'Sriracha Aioli']
  },
  {
    id: 5,
    name: 'Velvet Chocolate Lava Cake',
    category: 'Artisan Desserts',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
    description: 'A decadent rich chocolate cake with a warm, molten Belgian chocolate center, served with house-made Madagascar vanilla bean gelato and a fresh raspberry coulis.',
    prepTime: '25 mins',
    rating: 4.9,
    ingredients: ['Belgian Chocolate', 'Vanilla Gelato', 'Raspberry Coulis', 'Madagascar Vanilla Bean']
  },
  {
    id: 6,
    name: 'Creamy Pesto Penne',
    category: 'Classic Pasta',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    description: 'Al dente penne pasta tossed in a velvety sweet basil pesto cream sauce, roasted garlic, sun-dried tomatoes, and topped with shaved Parmigiano-Reggiano.',
    prepTime: '14 mins',
    rating: 4.7,
    ingredients: ['Penne Pasta', 'Sweet Basil Pesto', 'Heavy Cream', 'Sun-dried Tomatoes', 'Parmigiano-Reggiano']
  }
];

export default function ChefGallery() {
  const [selectedItem, setSelectedItem] = useState(null);

  const openLightbox = (item) => {
    setSelectedItem(item);
  };

  const closeLightbox = () => {
    setSelectedItem(null);
  };

  return (
    <section className="chef-gallery-section" aria-label="Chef Specials Gallery">
      <div className="container">
        <div className="gallery-header">
          <h2 className="section-title">Signature Gallery</h2>
          <p className="gallery-subtitle">A visual showcase of our chef's masterpiece creations and premium dishes</p>
        </div>

        <div className="gallery-grid">
          {GALLERY_ITEMS.map((item) => (
            <SpotlightCard
              key={item.id}
              className="gallery-card"
              onClick={() => openLightbox(item)}
              spotlightColor="rgba(255, 209, 102, 0.15)"
              tilt={true}
            >
              <div className="gallery-img-wrap">
                <img src={item.image} alt={item.name} className="gallery-img" loading="lazy" />
                <div className="gallery-card-overlay">
                  <span className="gallery-card-cat">{item.category}</span>
                  <h3 className="gallery-card-title">{item.name}</h3>
                  <button className="gallery-view-btn">View Masterpiece</button>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>

      {/* Lightbox / Details Modal */}
      {selectedItem && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Close modal">✕</button>
            
            <div className="lightbox-grid">
              <div className="lightbox-img-wrap">
                <img src={selectedItem.image} alt={selectedItem.name} className="lightbox-img" />
              </div>
              <div className="lightbox-details">
                <span className="lightbox-cat">{selectedItem.category}</span>
                <h2 className="lightbox-title">{selectedItem.name}</h2>
                <div className="lightbox-meta">
                  <span className="lightbox-rating">⭐ {selectedItem.rating.toFixed(1)}</span>
                  <span className="lightbox-time">⏱️ {selectedItem.prepTime}</span>
                </div>
                <p className="lightbox-desc">{selectedItem.description}</p>
                
                <div className="lightbox-ingredients-wrap">
                  <h4 className="ingredients-heading">Ingredients</h4>
                  <div className="ingredients-tags">
                    {selectedItem.ingredients.map((ing, idx) => (
                      <span key={idx} className="ingredient-tag">{ing}</span>
                    ))}
                  </div>
                </div>

                <div className="lightbox-footer">
                  <button className="btn-primary" onClick={closeLightbox}>Back to Gallery</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
