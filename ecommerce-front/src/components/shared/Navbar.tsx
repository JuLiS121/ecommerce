import Logo from './Logo';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { BsCart3 } from 'react-icons/bs';
import { IoSearch } from 'react-icons/io5';
import { CartProductType } from '@/lib/types';
import { CiLocationOn } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import CartContext from '@/context/CartContext';
import ProductContext from '@/context/ProductContext';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import AuthContext, { ContextData } from '@/context/AuthContext';

const Navbar = () => {
  const { location } = useGeolocation();

  const { user, logoutUser } = useContext(AuthContext) as ContextData;
  const { getSearchedProducts } = useContext(ProductContext);
  const { cartNumber, setCartNumber, getCartProducts } =
    useContext(CartContext);

  const [value, setValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCartProducts();
      const totalQuantity = data?.reduce(
        (total: number, currentItem: CartProductType) => {
          return total + currentItem.quantity;
        },
        0
      );
      setCartNumber(totalQuantity || 0);
    };
    fetchData();
  }, [getCartProducts, setCartNumber]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value === '') navigate('/products');
    else {
      const data = await getSearchedProducts(value);
      if (!data?.length) {
        navigate('/products');
      } else {
        navigate(`/searched-products/${value}`);
      }
    }
  };

  return (
    <nav className="hidden w-full h-24 md:flex items-center justify-between bg-black gap-1">
      <div className="flex items-center justify-between gap-2 h-full">
        <Logo color="orange-500" flex="col" text="base" />
        {!user?.is_admin ? (
          <Button className="bg-black hover:bg-black hover:border hover:border-orange-400 rounded-none focus:border focus:border-orange-400 flex flex-col items-start pl-5 relative">
            <span className="text-sm font-light">
              Deliver to {user ? user.username : ''}
            </span>

            <span className="font-bold flex items-center justify-start">
              <CiLocationOn className="absolute left-0 bottom-3" size={20} />
              {user
                ? `${location?.city || ''} ${location?.zipCode || ''}`
                : location?.country || ''}
            </span>
          </Button>
        ) : (
          <div className="flex flex-col gap-1 items-center justify-center">
            <Button
              className="bg-black hover:bg-black hover:border hover:border-orange-400 rounded-none focus:border focus:border-orange-400"
              onClick={() => navigate('/create-category')}
            >
              Add Category
            </Button>
            <Button
              className="bg-black hover:bg-black hover:border hover:border-orange-400 rounded-none focus:border focus:border-orange-400"
              onClick={() => navigate('/create-product')}
            >
              Add Profuct
            </Button>
          </div>
        )}
      </div>
      <form
        className="flex-auto max-w-[700px] flex items-center"
        onSubmit={handleSubmit}
      >
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="search"
          className="pr-10"
          placeholder="Search"
        />
        <Button
          type="submit"
          className="bg-orange-400 hover:bg-orange-400 -ml-14"
        >
          <IoSearch color="black" size={24} />
        </Button>
      </form>
      <div className="flex items-center justify-between gap-4 mr-4">
        <Button
          onClick={() => {
            if (!user) navigate('/login');
            else {
              logoutUser();
            }
          }}
          className=" bg-black hover:bg-black hover:border hover:border-orange-400 rounded-none focus:border focus:border-orange-400"
        >
          {!user ? `Hello, sign in` : <span>Log out</span>}
        </Button>
        <Button
          onClick={() => navigate('/cart')}
          className="bg-black rounded-none hover:bg-black hover:border hover:border-orange-400 rounded-none focus:border focus:border-orange-400 text-center relative font-bold"
        >
          <BsCart3 size={20} className="mr-1" />
          Cart
          <span className="rounded-full text-orange-500 font-bold text-lg absolute left-5 top-[-2px] z-20">
            {cartNumber}
          </span>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
