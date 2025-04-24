import CartContext from '@/context/CartContext';
import { CartProductType, ProductType } from '@/lib/types';
import { useContext, useEffect, useState } from 'react';

const domain = import.meta.env.VITE_DOMAIN;

const CartProduct = ({ product }: { product: CartProductType }) => {
  const [products, setProducts] = useState<ProductType | null>(null);
  const {
    getProducts,
    updateQuantity,
    deleteCartProduct,
    cartNumber,
    setCartNumber,
  } = useContext(CartContext);
  const [options, setOptions] = useState<number[]>([]);

  useEffect(() => {
    function generateArray() {
      const result = [];
      for (let i = 0; i <= (products?.quantity_available || 0); i++) {
        result.push(i);
      }
      setOptions(result);
    }
    generateArray();
  }, [products?.quantity_available]);

  useEffect(() => {
    const fetchData = async () => {
      const cartProducts = await getProducts(product.product);
      setProducts(cartProducts);
    };
    fetchData();
  }, [getProducts, product]);

  if (!products) return;

  return (
    <div className="w-[90%] mx-auto mb-5 flex flex-col md:flex-row justify-between h-fit md:h-72 gap-3 border border-orange-500 md:pr-2">
      <img
        className="w-full md:w-1/3 h-1/2 md:h-full border-b md:border-r border-orange-500"
        src={`${domain.slice(0, -4)}/${products.product_image}`}
        alt={products.name}
      />
      <div className="flex flex-col items-start justify-start p-2 md:pt-2 md:pr-2">
        <span className="font-bold text-lg">{products.name}</span>
        <span>{products.description}</span>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center justify-between gap-5 pr-2 w-fit">
            <span className="font-bold text-lg">${products.price}</span>
            <div className="flex items-center gap-2">
              <span className="font-bold">Quantity:</span>
              <select
                onChange={(e) => {
                  updateQuantity(
                    product.id,
                    product.product,
                    Number(e.target.value)
                  );
                  if (Number(e.target.value) === 0) {
                    deleteCartProduct(product.id, product.product);
                    setProducts(null);
                  }
                  setCartNumber(
                    cartNumber + (Number(e.target.value) - product.quantity)
                  );
                }}
              >
                <option value={product.quantity}>{product.quantity}</option>
                {options.map((option) => (
                  <option value={option}>
                    {option === 0 ? `${option}(Delete)` : option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <span className="font-bold text-lg">
            Total: $
            {Number(
              product && products && product.quantity * products?.price
            ).toFixed(2)}
          </span>
        </div>
        <span>
          <strong>{products?.quantity_available} </strong>
          items left in the stock
        </span>
      </div>
    </div>
  );
};

export default CartProduct;
