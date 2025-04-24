import AuthContext from '@/context/AuthContext';
import CartContext from '@/context/CartContext';
import { ProductType } from '@/lib/types';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const domain = import.meta.env.VITE_DOMAIN;

const SingleProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState<ProductType | null>(null);
  const { user } = useContext(AuthContext);
  const {
    getProducts,
    setCartNumber,
    cartNumber,
    addCartProduct,
    getCartProducts,
    cartProducts,
    setCartProducts,
  } = useContext(CartContext);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCartProducts();
      setCartProducts(data);
    };
    fetchData();
  }, [getCartProducts, setCartProducts]);

  useEffect(() => {
    const fetchData = async () => {
      const products = await getProducts(Number(id));
      setProduct(products);
    };
    fetchData();
  }, [getProducts, id]);

  return (
    <div className="w-[90%] mx-auto my-10 md:mt-20 flex flex-col md:flex-row items-center justify-between h-fit md:h-72 gap-3 border border-orange-500 md:pr-2">
      <img
        className="w-full h-1/2 md:w-1/3 md:h-full border-r border-orange-500"
        src={`${domain.slice(0, -4)}/${product?.product_image}`}
        alt={product?.name}
      />
      <div className="flex flex-col items-start justify-between p-2 gap-2.5">
        <span className="font-bold">{product?.name}</span>
        <span>{product?.description}</span>
        <div className="flex items-center justify-between w-full">
          <span className="font-bold">${product?.price}</span>
          {user?.username &&
            (!cartProducts
              ?.map((product) => product.product)
              .includes(product?.id as number) ? (
              <button
                onClick={() => {
                  setCartNumber(cartNumber + 1);
                  addCartProduct(product?.id as number, 1);
                }}
                className="bg-yellow-300 rounded-2xl px-10 py-1 text-sm font-semibold"
              >
                Add to cart
              </button>
            ) : (
              <button
                onClick={() => navigate('/cart')}
                className="bg-orange-700 rounded-2xl px-10 py-1 text-sm text-white font-semibold"
              >
                Product in cart
              </button>
            ))}
        </div>
        <span>
          <strong>{product?.quantity_available}</strong> items left in the stock
        </span>
      </div>
    </div>
  );
};

export default SingleProductPage;
