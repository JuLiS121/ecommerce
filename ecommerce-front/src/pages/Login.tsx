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
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import AuthContext from '@/context/AuthContext';
import { useContext } from 'react';

const formSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, {
      message: 'Password must be at least 8 characters.',
    })
    .max(20, {
      message: "Password can't be longer than 20 characters.",
    }),
});

const Login = () => {
  const { loginUser } = useContext(AuthContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    loginUser(values.email, values.password);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto border border-gray-200 w-[350px] p-5 my-10 flex flex-col gap-3"
      >
        <span className="font-semibold text-3xl mb-4">Log In</span>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full my-3 font-bold text-center">
          Log In
        </Button>
        <span className="flex items-center justify-center gap-3">
          Don't have an account?
          <Link to="/register" className="text-red-500 font-bold ">
            Register
          </Link>
        </span>
      </form>
    </Form>
  );
};

export default Login;
