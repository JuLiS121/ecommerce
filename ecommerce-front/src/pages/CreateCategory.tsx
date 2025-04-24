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

import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import ProductContext from '@/context/ProductContext';
import AuthContext from '@/context/AuthContext';

const formSchema = z.object({
  name: z
    .string()
    .max(50, { message: "The category name can't be more than 50 caracters" }),
});

const CreateCategory = () => {
  const [image, setImage] = useState<File | undefined>(undefined);
  const { user } = useContext(AuthContext);
  const { createCategory } = useContext(ProductContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createCategory(values.name, image as File);
  }

  return (
    <>
      {user?.is_admin ? (
        <Form {...form}>
          <form
            encType="multipart/form-data"
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto border border-gray-200 w-[350px] p-5 my-10 flex flex-col gap-3"
          >
            <span className="font-semibold text-3xl mb-4">Add Category</span>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      required
                      placeholder="Enter the category's name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <Label htmlFor="image">Category Image</Label>
              <Input
                id="image"
                accept="image/*"
                type="file"
                required
                onChange={(e) => setImage(e.target.files?.[0])}
              />
            </FormItem>

            <Button type="submit" className="w-full my-3 font-bold text-center">
              Add Category
            </Button>
          </form>
        </Form>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default CreateCategory;
