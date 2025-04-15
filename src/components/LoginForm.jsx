"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "motion/react";

// Zod validation schema
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/\d/, "Password must contain at least one number"),
});

export default function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "", 
      password: "", 
    },
  });

  // Handle form submission
  function onSubmit(values) {
    console.log(values);
  }

  return (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-[450px] min-h-[480px] text-black mx-auto bg-white rounded-xl px-10 py-14 flex flex-col items-center shadow-md">
      <div className="text-2xl font-semibold mb-2">Đăng nhập vào tài khoản</div>
      <div className="text-sm font-medium text-gray-600 mb-6">
        Hãy nhập email và mật khẩu của bạn để tiếp tục.
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mx-4 flex flex-col gap-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tài khoản Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@gmail.com" {...field} />
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
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input placeholder="********" {...field} type="password" />
                </FormControl>
                <FormMessage />
                <div className="flex items-center gap-1">
                    <Checkbox id='remember'  className='border-blue-200 data-[state=checked]:bg-blue-500'/>
                    <label htmlFor="remember" className="text-xs text-gray-500">Ghi nhớ mật khẩu</label>
                </div>
              </FormItem>
            )}
          />
          <Button type="submit" className='w-[300px] self-center bg-blue-500 hover:bg-blue-700 mt-4'>Đăng nhập</Button>
        </form>
      </Form>
    </motion.div>
  );
}
