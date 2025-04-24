import { useNavigate } from 'react-router-dom';
import { CategoryType } from '../lib/types';
import { Link } from 'react-router-dom';

const domain = import.meta.env.VITE_DOMAIN;

const Category = ({ category }: { category: CategoryType }) => {
  const navigate = useNavigate();
  return (
    <div className="border mx-2 mt-2 mb-3 border-orange-500 h-[400px] flex flex-col items-start justify-between pt-4 pb-2">
      <span className="font-bold text-xl pl-4 h-[40px] max-h-[40px] min-h-[40px]">
        {category.category_name}
      </span>
      <img
        className="w-[90%] h-[70%] cursor-pointer mx-auto"
        onClick={() => navigate(`/${category.category_name}`)}
        src={`${domain.slice(0, -4)}/${category.category_image}`}
        alt="computers"
      />
      <Link to={category.category_name} className="pl-4 font-bold text-base">
        Shop now
      </Link>
    </div>
  );
};

export default Category;
