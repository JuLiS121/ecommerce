import { useContext } from 'react';
import ProductContext from '@/context/ProductContext';
import Product from '../components/shared/Product';

const SearchProducts = () => {
  const { searchedProducts } = useContext(ProductContext);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:my-10 md:mx-8">
      {searchedProducts?.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  );
};

export default SearchProducts;
