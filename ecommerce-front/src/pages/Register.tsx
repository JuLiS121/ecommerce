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
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  username: z
    .string({ required_error: 'Username is required' })
    .min(4, { message: 'Username must be at least 4 characters.' })
    .max(20, { message: "Username can't be more than 20 characters." }),
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
  confirmPassword: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters.',
    })
    .max(20, {
      message: "Password can't be longer than 20 characters.",
    }),
});

const Register = () => {
  const { toast } = useToast();
  const { registerUser } = useContext(AuthContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.password === values.confirmPassword)
      registerUser(values.username, values.email, values.password);
    else {
      toast({
        description: 'Passwords are not the same',
      });
      return;
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto border border-gray-200 w-[350px] p-5 my-10 flex flex-col gap-3"
      >
        <span className="font-semibold text-3xl mb-4">Create Account</span>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Enter your username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                <Input
                  type="password"
                  placeholder="Enter your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full my-3 font-bold text-center">
          Register
        </Button>
        <span className="flex items-center justify-center gap-3">
          Already have an account?
          <Link to="/login" className="text-red-500 font-bold ">
            Log In
          </Link>
        </span>
      </form>
    </Form>
  );
};

export default Register;
