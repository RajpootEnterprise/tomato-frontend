import { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { BASE_URL } from '../../api/client';
import toast from 'react-hot-toast';
import './StripePaymentForm.css';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#2d2d2d',
      fontFamily: 'Outfit, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aaaaaa',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

export default function StripePaymentForm({ amount, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [billing, setBilling] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const handleChange = (e) => {
    setBilling((b) => ({ ...b, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      // 1. Create PaymentIntent on the backend
      const token = localStorage.getItem('tomato_token');
      const intentRes = await axios.post(
        `${BASE_URL}/payment/create-intent`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { clientSecret } = intentRes.data.data;

      // 2. Confirm the payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: billing.name,
            address: {
              line1: billing.address,
              city: billing.city,
              state: billing.state,
              postal_code: billing.zip,
            },
          },
        },
      });

      if (result.error) {
        toast.error(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // 3. Confirm with our backend
          const confirmRes = await axios.post(
            `${BASE_URL}/payment/confirm`,
            { paymentIntentId: result.paymentIntent.id },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (confirmRes.data.success) {
            toast.success('Payment succeeded!');
            onSuccess(result.paymentIntent.id);
          } else {
            toast.error('Payment confirmation failed in backend');
          }
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      <h3 className="payment-title">💳 Secure Card Checkout</h3>
      <p className="payment-subtitle">Enter your delivery address and card details to complete payment of <strong>${amount?.toFixed(2)}</strong></p>
      
      {/* Billing / Address Grid */}
      <div className="payment-form-grid">
        <div className="payment-input-group form-col-full">
          <label htmlFor="payment-name">Cardholder Name</label>
          <input
            id="payment-name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={billing.name}
            onChange={handleChange}
            required
            className="payment-input"
            autoComplete="name"
          />
        </div>

        <div className="payment-input-group form-col-full">
          <label htmlFor="payment-address">Delivery Address</label>
          <input
            id="payment-address"
            name="address"
            type="text"
            placeholder="123 Foodie Street, Apt 4B"
            value={billing.address}
            onChange={handleChange}
            required
            className="payment-input"
            autoComplete="street-address"
          />
        </div>

        <div className="payment-input-group">
          <label htmlFor="payment-city">City</label>
          <input
            id="payment-city"
            name="city"
            type="text"
            placeholder="New York"
            value={billing.city}
            onChange={handleChange}
            required
            className="payment-input"
            autoComplete="address-level2"
          />
        </div>

        <div className="payment-input-group-half">
          <div className="payment-form-grid-inner">
            <div className="payment-input-group">
              <label htmlFor="payment-state">State</label>
              <input
                id="payment-state"
                name="state"
                type="text"
                placeholder="NY"
                value={billing.state}
                onChange={handleChange}
                required
                className="payment-input"
                autoComplete="address-level1"
              />
            </div>
            <div className="payment-input-group">
              <label htmlFor="payment-zip">ZIP Code</label>
              <input
                id="payment-zip"
                name="zip"
                type="text"
                placeholder="10001"
                value={billing.zip}
                onChange={handleChange}
                required
                className="payment-input"
                autoComplete="postal-code"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="payment-input-group form-col-full">
        <label>Card Details</label>
        <div className="card-input-wrapper">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
      </div>

      <div className="payment-actions">
        <button type="button" className="btn-outline cancel-payment-btn" onClick={onCancel} disabled={processing}>
          Cancel
        </button>
        <button type="submit" className="btn-primary pay-submit-btn" disabled={!stripe || processing}>
          {processing ? (
            <>
              <span className="spinner-sm" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }} />
              Processing…
            </>
          ) : (
            `Pay $${amount?.toFixed(2)}`
          )}
        </button>
      </div>

      <div className="test-cards-hint">
        💡 Use Stripe test card: <span className="card-num">4242 • 4242 • 4242 • 4242</span>, Exp: any future date, CVC: any 3 digits.
      </div>
    </form>
  );
}
