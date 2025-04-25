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
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth/authContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const formSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  password: z
    .string()
    .regex(/[a-zA-Z]/, "Password must contain at least one letter"),
  remember: z.boolean().optional(),
});

export default function LoginForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      password: "",
      remember: false,
    },
  });

  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const rememberedUserName = localStorage.getItem("rememberedUserName") || "";
      form.setValue("userName", rememberedUserName);
    }
  }, [form]);

  async function onSubmit(values) {
    setError(null);
    setIsLoading(true);
    try {
      await login(values.userName, values.password);
      if (values.remember) {
        localStorage.setItem("rememberedUserName", values.userName);
      } else {
        localStorage.removeItem("rememberedUserName");
      }
      router.push("/imports");
    } catch (error) {
      setError(error.message || "Đăng nhập thất bại");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="w-[450px] min-h-[480px] text-black mx-auto bg-white rounded-xl px-10 py-14 flex flex-col items-center shadow-md"
    >
      <div className="text-2xl font-semibold mb-2">Login to Account</div>
      <div className="text-sm font-medium text-gray-600 mb-6">
        Please enter your username and password to continue.
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full mx-4 flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
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
                  <Input placeholder="********" {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <FormItem className="flex items-center gap-1">
                <FormControl>
                  <Checkbox
                    id="remember"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="border-blue-200 data-[state=checked]:bg-blue-500"
                  />
                </FormControl>
                <FormLabel htmlFor="remember" className="text-xs text-gray-500">
                  Remember password
                </FormLabel>
              </FormItem>
            )}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            type="submit"
            className="w-[300px] self-center bg-blue-500 hover:bg-blue-700 mt-4 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </>
            ) : (
              "Log in"
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}