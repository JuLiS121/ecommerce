import { useNavigate } from 'react-router-dom';
import CartContext from '@/context/CartContext';
import { Button } from '../components/ui/button';
import React, { useContext, useEffect } from 'react';

const Success: React.FC = () => {
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    const fetchData = async () => {
      const paymentSuccess = localStorage.getItem('paymentSuccess');

      if (!paymentSuccess || paymentSuccess !== 'true') {
        navigate('/');
      }

      localStorage.removeItem('paymentSuccess');
      await clearCart();
    };
    fetchData();
  }, [navigate, clearCart]);

  return (
    <div className="w-full h-screen flex flex-col gap-3 items-center justify-center shadow-2xl rounded-2xl bg-white p-4">
      <h1>Payment Successful!</h1>
      <p>Your order has been placed successfully.</p>
      <Button onClick={() => navigate('/')}>Home</Button>
    </div>
  );
};

export default Success;
