import { useContext, useEffect, useState } from 'react';
import ProductContext from '@/context/ProductContext';
import Product from '../components/shared/Product';

import { ProductType } from '@/lib/types';

const Products = () => {
  const [products, setProducts] = useState<ProductType[] | null>(null);
  const { getProducts } = useContext(ProductContext);

  useEffect(() => {
    const getAllProducts = async () => {
      const products = await getProducts();
      setProducts(products);
    };
    getAllProducts();
  }, [getProducts]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:my-10 md:mx-8">
      {products?.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Products;
