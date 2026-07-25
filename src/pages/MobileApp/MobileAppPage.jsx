import './MobileAppPage.css';

const FEATURES = [
  { icon: '⚡', title: 'Lightning Fast', desc: 'Order in seconds with our streamlined app experience.' },
  { icon: '🔔', title: 'Real-time Tracking', desc: 'Track your order from kitchen to doorstep in real time.' },
  { icon: '💳', title: 'Easy Payments', desc: 'Multiple payment options including UPI, cards, and wallets.' },
  { icon: '⭐', title: 'Exclusive Deals', desc: 'App-only offers, discounts, and loyalty rewards.' },
  { icon: '🗓️', title: 'Schedule Orders', desc: 'Plan ahead and schedule your meals in advance.' },
  { icon: '🛡️', title: 'Safe & Secure', desc: '100% secure payments and data privacy guaranteed.' },
];

export default function MobileAppPage() {
  return (
    <main className="app-page">
      {/* Hero */}
      <section className="app-hero">
        <div className="app-hero-bg-circle c1" />
        <div className="app-hero-bg-circle c2" />
        <div className="container app-hero-inner">
          <div className="app-hero-text">
            <div className="app-tag">📱 Now Available</div>
            <h1 className="app-hero-title">
              Order Faster with<br />
              <span className="app-highlight">Tomato App</span>
            </h1>
            <p className="app-hero-desc">
              Experience the best food ordering on the go. Download the Tomato app
              and enjoy exclusive app-only deals, real-time tracking, and lightning-fast ordering.
            </p>
            <div className="app-badges-lg">
              <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="app-badge-lg" id="google-play-link">
                <span className="badge-icon">▶</span>
                <div>
                  <span className="badge-sm">GET IT ON</span>
                  <span className="badge-lg">Google Play</span>
                </div>
              </a>
              <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="app-badge-lg" id="app-store-link">
                <span className="badge-icon"></span>
                <div>
                  <span className="badge-sm">Download on the</span>
                  <span className="badge-lg">App Store</span>
                </div>
              </a>
            </div>
            <div className="app-rating">
              <div className="app-stars">★★★★★</div>
              <span>4.8/5 from 10,000+ reviews</span>
            </div>
          </div>
          <div className="app-hero-image">
            <div className="phone-mockup">
              <div className="phone-screen">
                <div className="phone-notch" />
                <div className="phone-content">
                  <div className="phone-header">
                    <span>🍅 Tomato</span>
                    <div className="phone-avatar" />
                  </div>
                  <div className="phone-banner">
                    <p className="phone-banner-text">Today's Special</p>
                    <p className="phone-offer">30% Off</p>
                  </div>
                  <div className="phone-categories">
                    {['🥗', '🌯', '🍮', '🍝'].map((e) => (
                      <div key={e} className="phone-cat">{e}</div>
                    ))}
                  </div>
                  <div className="phone-card" />
                  <div className="phone-card phone-card-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="app-features">
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Why Use the App?</h2>
          <p className="app-features-sub">Everything you love about Tomato, now in your pocket</p>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="app-cta">
        <div className="container app-cta-inner">
          <h2 className="app-cta-title">Ready to Order?</h2>
          <p className="app-cta-sub">Join over 50,000 happy customers ordering through Tomato</p>
          <div className="app-badges-lg app-cta-badges">
            <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="app-badge-lg light">
              <span className="badge-icon">▶</span>
              <div>
                <span className="badge-sm">GET IT ON</span>
                <span className="badge-lg">Google Play</span>
              </div>
            </a>
            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="app-badge-lg light">
              <span className="badge-icon"></span>
              <div>
                <span className="badge-sm">Download on the</span>
                <span className="badge-lg">App Store</span>
              </div>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
