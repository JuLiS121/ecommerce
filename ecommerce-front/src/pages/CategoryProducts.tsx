import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ProductContext from '@/context/ProductContext';
import CategoryProduct from '../components/shared/CategoryProduct';

import { ProductType } from '../lib/types';

const CategoryProducts = () => {
  const [products, setProducts] = useState<ProductType[] | null>(null);
  const { getCategoryProducts } = useContext(ProductContext);
  const { category_name } = useParams();

  useEffect(() => {
    const getProducts = async () => {
      const categoryProducts = await getCategoryProducts(category_name || '');
      setProducts(categoryProducts);
    };
    getProducts();
  }, [category_name, getCategoryProducts]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:my-10 md:mx-8">
        {products?.map((product) => (
          <CategoryProduct key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CategoryProducts;
