import Logo from './Logo';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { BsCart3 } from 'react-icons/bs';
import { IoSearch } from 'react-icons/io5';
import { CiLocationOn } from 'react-icons/ci';
import { CartProductType } from '@/lib/types';
import { useNavigate } from 'react-router-dom';
import CartContext from '@/context/CartContext';
import ProductContext from '@/context/ProductContext';
import { FormEvent, useContext, useEffect, useState } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import AuthContext, { ContextData } from '@/context/AuthContext';

const MobileNav = () => {
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
    <nav className="md:hidden w-full h-fit flex flex-col items-center justify-between bg-black gap-1 px-1">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center justify-between h-full">
          <Logo color="orange-500" flex="col" text="base" />
        </div>

        <div className="flex items-center justify-between">
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
      </div>
      <form
        className="flex-auto w-full mx-2 flex items-center"
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
      {!user?.is_admin ? (
        <div className="w-full flex items-center justfy-start pl-2 py-1">
          <Button
            className={`bg-black hover:bg-black hover:border hover:border-orange-400 rounded-none flex pl-5 ${
              user ? 'flex-col' : 'flex-row gap-2 justify-start'
            } items-start relative`}
          >
            <span className={`text-sm font-light`}>
              Deliver to {user ? user.username : ''}
            </span>
            <span className="font-bold flex items-center justify-start">
              <CiLocationOn
                className={`absolute left-0 ${user && 'bottom-3'}`}
                size={20}
              />
              {user
                ? `${location?.city || ''} ${location?.zipCode || ''}`
                : location?.country || ''}
            </span>
          </Button>
        </div>
      ) : (
        <div className="w-full px-2 py-1 flex items-center justify-center gap-2">
          <Button
            className="bg-black hover:bg-black hover:border hover:border-orange-400 rounded-none focus:border focus:border-orange-400"
            onClick={() => navigate('/create-product')}
          >
            Add Profuct
          </Button>
          <Button
            className="bg-black hover:bg-black hover:border hover:border-orange-400 rounded-none focus:border focus:border-orange-400"
            onClick={() => navigate('/create-category')}
          >
            Add Category
          </Button>
        </div>
      )}
    </nav>
  );
};

export default MobileNav;
