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
      <p className="payment-subtitle">Enter card details to complete payment of <strong>${amount?.toFixed(2)}</strong></p>
      
      <div className="card-input-wrapper">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
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
