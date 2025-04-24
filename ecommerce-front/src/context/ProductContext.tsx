import { useNavigate } from 'react-router-dom';
import { createContext, useCallback, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CategoryType, ProductType } from './../lib/types/index';

const domain = import.meta.env.VITE_DOMAIN;

export interface ProductContextType {
  searchedProducts: ProductType[] | null;
  createCategory: (name: string, image: File) => Promise<void>;
  createProduct: (
    name: string,
    description: string,
    price: number,
    quantity_available: number,
    product_image: File,
    category: string
  ) => Promise<void>;
  getCategory: (id: number) => Promise<CategoryType | null>;
  getProducts: () => Promise<ProductType[] | null>;
  getAllCategories: () => Promise<CategoryType[] | null>;
  getCategoryProducts: (categoryName: string) => Promise<ProductType[] | null>;
  getSearchedProducts: (name: string) => Promise<ProductType[] | null>;
}

const ProductContext = createContext<ProductContextType>({
  searchedProducts: null,
  createCategory: async () => {},
  createProduct: async () => {},
  getCategory: async () => null,
  getProducts: async () => null,
  getAllCategories: async () => null,
  getCategoryProducts: async () => null,
  getSearchedProducts: async () => null,
});

export default ProductContext;

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchedProducts, setSearchedProducts] = useState<
    ProductType[] | null
  >(null);

  const createCategory = async (name: string, image: File) => {
    try {
      const formData = new FormData();
      formData.append('category_name', name);
      formData.append('category_image', image);
      const response = await fetch(`${domain}create-category/`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        toast({
          variant: 'success',
          description: 'Category added successfully',
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Upps, something went wrong',
      });
      return;
    }
  };

  const createProduct = async (
    name: string,
    description: string,
    price: number,
    quantity_available: number,
    product_image: File,
    category: string
  ) => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price.toString());
      formData.append('quantity_available', quantity_available.toString());
      formData.append('product_image', product_image);
      formData.append('category', category);
      const response = await fetch(`${domain}create-product/`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        toast({
          variant: 'success',
          description: 'Product added successfully',
        });
        navigate('/');
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Upps, something went wrong',
      });
      return;
    }
  };

  const getSearchedProducts = async (name: string) => {
    try {
      const response = await fetch(`${domain}searched-products/${name}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'aplication/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSearchedProducts(data);
        return data;
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Upps, something went wrong',
      });
      return;
    }
  };

  const getCategory = async (id: number) => {
    try {
      const response = await fetch(`${domain}category/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'aplication/json',
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
      return;
    }
  };

  const getProducts = useCallback(async () => {
    try {
      const response = await fetch(`${domain}all-products/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'aplication/json',
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
      return;
    }
  }, [toast]);

  const getAllCategories = useCallback(async () => {
    try {
      const response = await fetch(`${domain}all-categories/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'aplication/json',
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
      return;
    }
  }, [toast]);

  const getCategoryProducts = async (categoryName: string) => {
    try {
      const id = await getAllCategories();
      const categoryId = id.find(
        (id: CategoryType) => id.category_name === categoryName
      );
      const response = await fetch(
        `${domain}category-products/${categoryId.id}/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'aplication/json',
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Upps, something went wrong',
      });
      return;
    }
  };

  const contextData = {
    searchedProducts,
    createCategory,
    createProduct,
    getProducts,
    getCategory,
    getAllCategories,
    getCategoryProducts,
    getSearchedProducts,
  };
  return (
    <ProductContext.Provider value={contextData}>
      {children}
    </ProductContext.Provider>
  );
};
