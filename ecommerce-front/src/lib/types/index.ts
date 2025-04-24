export interface CategoryType {
  id: number;
  category_name: string;
  category_image: File;
}

export interface ProductType {
  id: number;
  name: string;
  description: string;
  category: number;
  price: number;
  quantity_available: number;
  product_image: string;
}

export interface CartProductType {
  id: number;
  customer: number;
  product: number;
  quantity: number;
}
