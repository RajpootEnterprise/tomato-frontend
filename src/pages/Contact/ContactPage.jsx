import { useState } from 'react';
import { sendContact } from '../../api/contact';
import toast from 'react-hot-toast';
import SpotlightCard from '../../components/SpotlightCard/SpotlightCard';
import DecryptedText from '../../components/DecryptedText/DecryptedText';
import './ContactPage.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await sendContact(form);
      const body = res.data;
      if (body.success) {
        toast.success(body.message || 'Message sent!');
        setSent(true);
        setForm({ name: '', email: '', message: '' });
      } else {
        toast.error(body.message || 'Failed to send message');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="contact-page">
      {/* Header */}
      <div className="contact-header">
        <div className="container">
          <h1 className="contact-title">
            <DecryptedText text="Get in Touch" animateOn="view" speed={55} maxIterations={12} />
          </h1>
          <p className="contact-sub">We'd love to hear from you. Drop us a message!</p>
        </div>
      </div>

      <div className="container contact-body">
        {/* Info cards */}
        <div className="contact-info">
          <SpotlightCard className="info-card" spotlightColor="rgba(255, 107, 53, 0.15)">
            <div className="info-icon">📞</div>
            <h3>Phone</h3>
            <p>+1 (555) 000-1234</p>
          </SpotlightCard>
          <SpotlightCard className="info-card" spotlightColor="rgba(255, 107, 53, 0.15)">
            <div className="info-icon">✉️</div>
            <h3>Email</h3>
            <p>contact@tomato.food</p>
          </SpotlightCard>
          <SpotlightCard className="info-card" spotlightColor="rgba(255, 107, 53, 0.15)">
            <div className="info-icon">📍</div>
            <h3>Address</h3>
            <p>New York, NY 10001</p>
          </SpotlightCard>
          <SpotlightCard className="info-card" spotlightColor="rgba(255, 107, 53, 0.15)">
            <div className="info-icon">🕑</div>
            <h3>Hours</h3>
            <p>Mon–Sun: 9am – 11pm</p>
          </SpotlightCard>
        </div>

        {/* Form */}
        <div className="contact-form-wrap">
          {sent ? (
            <div className="contact-success">
              <span className="success-icon">🎉</span>
              <h2>Message Sent!</h2>
              <p>We'll get back to you as soon as possible.</p>
              <button className="btn-primary" onClick={() => setSent(false)}>Send Another</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <h2 className="form-heading">Send us a Message</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="contact-name">Your Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  placeholder="Hi, I have a question about…"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary contact-submit"
                disabled={loading}
                id="contact-submit-btn"
              >
                {loading ? (
                  <>
                    <span className="spinner-sm" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Message
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
