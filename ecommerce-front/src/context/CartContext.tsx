import AuthContext from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { CartProductType, ProductType } from '@/lib/types';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import ProductContext from './ProductContext';

const domain = import.meta.env.VITE_DOMAIN;

export interface CartContext {
  cartNumber: number;
  price: number;
  cartProducts: CartProductType[];
  setCartProducts: React.Dispatch<React.SetStateAction<CartProductType[]>>;
  setPrice: (arg0: number) => void;
  setCartNumber: (arg0: number) => void;
  addCartProduct: (productId: number, quantity: number) => Promise<void>;
  getCartProducts: () => Promise<CartProductType[]>;
  getProducts: (productId: number) => Promise<ProductType | null>;
  updateQuantity: (
    id: number,
    product: number,
    quantity: number
  ) => Promise<void>;
  deleteCartProduct: (id: number, product: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContext>({
  cartNumber: 0,
  price: 0,
  cartProducts: [],
  setCartProducts: () => {},
  setPrice: () => {},
  setCartNumber: () => {},
  addCartProduct: async () => {},
  getCartProducts: async () => [],
  getProducts: async () => null,
  updateQuantity: async () => {},
  deleteCartProduct: async () => {},
  clearCart: async () => {},
});

export default CartContext;

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const { user } = useContext(AuthContext);
  const { getProducts: getProductsInfo } = useContext(ProductContext);
  const [price, setPrice] = useState(0);
  const [cartNumber, setCartNumber] = useState(0);
  const [cartProducts, setCartProducts] = useState<CartProductType[]>([]);

  const addCartProduct = async (productId: number, quantity: number) => {
    try {
      const response = await fetch(`${domain}add-cart-product/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: user?.user_id || '',
          product: productId,
          quantity,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setCartProducts((prevCartProducts) => [...prevCartProducts, data]);
        toast({
          variant: 'success',
          description: 'Product added successfully in the cart',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Upps, something went wrong',
      });
    }
  };

  const getCartProducts = useCallback(async () => {
    try {
      const response = await fetch(`${domain}cart-products/${user?.user_id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        const totalQuantity = data.reduce(
          (total: number, currentItem: CartProductType) => {
            return total + currentItem.quantity;
          },
          0
        );
        setCartNumber(totalQuantity);
        return data;
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Upps, something went wrong',
      });
    }
  }, [toast, user?.user_id]);

  const getProducts = useCallback(
    async (productId: number) => {
      try {
        const response = await fetch(`${domain}products/${productId}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          return data;
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          description: 'Upps, something went wrong',
        });
      }
    },
    [toast]
  );

  const updateQuantity = async (
    id: number,
    product: number,
    quantity: number
  ) => {
    try {
      const response = await fetch(
        `${domain}carts/${id}/products/${product}/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity }),
        }
      );
      if (response.ok) {
        setCartProducts(
          cartProducts.map((pro) =>
            pro.id === id ? { ...pro, quantity } : pro
          )
        );
        const data = await getProductsInfo();
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
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Upps, something went wrong',
      });
      return;
    }
  };

  const deleteCartProduct = async (id: number, product: number) => {
    try {
      const response = await fetch(
        `${domain}delete-cart-product/${id}/${product}/`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.ok) {
        setCartProducts(cartProducts.filter((pro) => pro.product !== id));
        toast({
          variant: 'success',
          description: 'Product removed from the cart',
        });
        return;
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Upps, something went wrong',
      });
      return;
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`${domain}clear-cart/${user?.user_id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setPrice(0);
        setCartNumber(0);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Upps, something went wrong',
      });
      return;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCartProducts();
      const uniqueProducts = data?.filter(
        (obj: CartProductType, index: number, self: CartProductType[]) =>
          index ===
          self.findIndex((o: CartProductType) => o.product === obj.product)
      );
      setCartProducts(uniqueProducts);
    };
    fetchData();
  }, [getCartProducts]);

  const cartContext = {
    cartNumber,
    price,
    cartProducts,
    setCartProducts,
    setPrice,
    setCartNumber,
    addCartProduct,
    getCartProducts,
    getProducts,
    updateQuantity,
    deleteCartProduct,
    clearCart,
  };
  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
};
