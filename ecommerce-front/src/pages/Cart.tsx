import AuthContext from '@/context/AuthContext';
import CartContext from '@/context/CartContext';
import { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import CartProduct from '../components/shared/CartProduct';
import ProductContext from '@/context/ProductContext';
import Checkout from '../components/shared/Checkout';

const Cart = () => {
  const { user } = useContext(AuthContext);
  const { getProducts } = useContext(ProductContext);
  const { price, setPrice, cartProducts } = useContext(CartContext);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts();
      const priceMap = new Map(data?.map((item) => [item.id, item.price]));

      const totalCosts = cartProducts?.map((item) => {
        const productId = item.product;
        const quantity = item.quantity;
        const price = priceMap.get(productId);
        const total = price ? (price as number) * quantity : 0;
        return { productId, total, quantity };
      });

      const totalQuantity = totalCosts?.reduce((total, currentItem) => {
        return Number(total + currentItem.total);
      }, 0);

      setPrice(Number(totalQuantity?.toFixed(2)));
    };
    fetchData();
  }, [getProducts, cartProducts, setPrice]);

  return (
    <div>
      {user ? (
        <div className="my-10">
          <div className="flex items-center justify-between w-[90%] mb-10 mx-auto">
            <h1 className="font-bold text-xl">Shopping Cart</h1>
            <div className="flex flex-col items-center border border-orange-500 p-2">
              <button className="font-bold text-lg rounded-full w-full p-1.5">
                Total: ${price}
              </button>
              {price ? <Checkout /> : null}
            </div>
          </div>
          {cartProducts?.map((product) => (
            <CartProduct key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Navigate to="/login" />
      )}
    </div>
  );
};

export default Cart;
