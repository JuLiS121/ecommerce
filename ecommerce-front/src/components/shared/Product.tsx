import AuthContext from '@/context/AuthContext';
import CartContext from '@/context/CartContext';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductType } from '../../lib/types';

const domain = import.meta.env.VITE_DOMAIN;

const Product = ({ product }: { product: ProductType }) => {
  const { user } = useContext(AuthContext);
  const {
    cartNumber,
    getCartProducts,
    setCartNumber,
    addCartProduct,
    cartProducts,
    setCartProducts,
  } = useContext(CartContext);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCartProducts();
      setCartProducts(data);
    };
    fetchData();
  }, [getCartProducts, setCartProducts]);

  return (
    <div className="md:border border-b border-orange-500 h-[400px]">
      <img
        src={`${domain.slice(0, -4)}/${product.product_image}`}
        alt={product.name}
        className="w-full h-1/2 cursor-pointer border-b border-orange-500"
        onClick={() => navigate(`/products/${product.id}`)}
      />
      <div className="w-full max-h-1/2 px-2 flex flex-col justify-around gap-1.5 my-2">
        <span
          className="font-bold text-xl mt-2 hover:text-orange-500 w-fit cursor-pointer"
          onClick={() => navigate(`/products/${product.id}`)}
        >
          {product.name}
        </span>
        <div className="flex items-center justify-between">
          <span className="font-bold text-xl">
            ${Number(product.price).toFixed(2)}
          </span>
          {user?.username &&
            (!cartProducts
              ?.map((product) => product.product)
              .includes(product.id) ? (
              <button
                onClick={() => {
                  setCartNumber(cartNumber + 1);
                  addCartProduct(product.id, 1);
                }}
                className="bg-yellow-300 rounded-xl px-1.5 py-1 text-xs font-semibold"
              >
                Add to cart
              </button>
            ) : (
              <span
                onClick={() => navigate('/cart')}
                className="bg-orange-700 rounded-xl px-1.5 py-1 text-xs text-white font-semibold cursor-pointer"
              >
                Product in cart
              </span>
            ))}
        </div>
        <span>
          <strong>{product.quantity_available}</strong> items left in the stock
        </span>
      </div>
    </div>
  );
};

export default Product;
