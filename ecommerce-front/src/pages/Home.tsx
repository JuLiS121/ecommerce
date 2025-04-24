import { useContext, useEffect, useState } from 'react';
import ProductContext from '@/context/ProductContext';
import Category from './Category';
import { IoMdArrowDroprightCircle } from 'react-icons/io';

import { CategoryType } from '../lib/types';
import { useNavigate } from 'react-router-dom';
import AuthContext from '@/context/AuthContext';

const Home = () => {
  const [categories, setCategories] = useState<CategoryType[] | null>(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { getAllCategories } = useContext(ProductContext);

  useEffect(() => {
    const getCategories = async () => {
      const category = await getAllCategories();
      setCategories(category);
    };
    getCategories();
  }, [getAllCategories, user]);

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mx-2 my-10 md:mx-5 md:mt-10">
        <span className="font-bold text-lg">
          Welcome {user && user.username}
        </span>
        <span
          className="font-bold text-lg cursor-pointer flex items-center gap-3"
          onClick={() => navigate('/products')}
        >
          Explore our products <IoMdArrowDroprightCircle size={25} />
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-4 lg:gap-6 md:mt-10 md:mx-8">
        {categories?.map((category) => (
          <Category key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
};

export default Home;
