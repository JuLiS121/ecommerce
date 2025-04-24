import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

import { useContext, useEffect, useState } from 'react';
import ProductContext from '@/context/ProductContext';
import { CategoryType } from '@/lib/types';
import AuthContext from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const formSchema = z.object({
  name: z
    .string()
    .max(50, { message: "The name can't be more than 50 caracters" }),
  description: z.string(),
});

const CreateProduct = () => {
  const { user } = useContext(AuthContext);
  const [price, setPrice] = useState(0);
  const [quantityAvailable, setQuantityAavailable] = useState(0);
  const [image, setImage] = useState<File | undefined>(undefined);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<CategoryType[] | null>(null);
  const { createProduct, getAllCategories } = useContext(ProductContext);

  useEffect(() => {
    const fetchData = async () => {
      const categories = await getAllCategories();
      setCategories(categories);
    };
    fetchData();
  }, [getAllCategories]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('category', category);
    console.log('image type', image?.type);
    createProduct(
      values.name,
      values.description,
      price,
      quantityAvailable,
      image as File,
      category
    );
  }

  if (!user?.is_admin) return <Navigate to="/" />;

  return (
    <Form {...form}>
      <form
        encType="multipart/form-data"
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto border border-gray-200 w-[350px] p-5 my-10 flex flex-col gap-3"
      >
        <span className="font-semibold text-3xl mb-4">Add Product</span>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  required
                  placeholder="Enter the product's name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  required
                  placeholder="Enter the product's description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <Label>Price</Label>
          <Input
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            type="number"
            step="0.01"
            min={0.0}
            placeholder="Enter the product's price"
          />
          <FormMessage />
        </FormItem>
        <FormItem>
          <Label>Available Quantity</Label>
          <Input
            value={quantityAvailable}
            onChange={(e) => setQuantityAavailable(Number(e.target.value))}
            type="number"
            min={0}
            placeholder="Enter the product's quantity available"
          />
          <FormMessage />
        </FormItem>
        <FormItem>
          <Label htmlFor="image">image</Label>
          <Input
            id="image"
            accept="image/*"
            type="file"
            required
            onChange={(e) => setImage(e.target.files?.[0])}
          />
        </FormItem>
        <FormItem>
          <select
            className="w-full border border-slate-200 rounded-md p-2"
            required
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option value="">Select a category</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </FormItem>

        <Button type="submit" className="w-full my-3 font-bold text-center">
          Add Product
        </Button>
      </form>
    </Form>
  );
};

export default CreateProduct;
