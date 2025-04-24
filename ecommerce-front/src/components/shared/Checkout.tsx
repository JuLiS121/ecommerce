import React, { useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import CartContext from '@/context/CartContext';
import { Button } from '../ui/button';

const domain = import.meta.env.VITE_DOMAIN;
const publicStripe = import.meta.env.VITE_STRIPE_PUBLIC;

const stripePromise = loadStripe(publicStripe);

const Checkout: React.FC = () => {
  const { price } = useContext(CartContext);

  const handleCheckout = async () => {
    const response = await fetch(`${domain}create-checkout-session/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ price }),
    });
    const session = await response.json();

    const stripe = await stripePromise;

    if (stripe) {
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
      } else {
        localStorage.setItem('paymentSuccess', 'true');
      }
    }
  };

  return (
    <Button
      role="link"
      onClick={handleCheckout}
      className="bg-orange-400 hover:bg-orange-500 text-black rounded-full w-full"
    >
      Checkout
    </Button>
  );
};

export default Checkout;
