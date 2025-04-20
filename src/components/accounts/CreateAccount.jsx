"use client";
import { set, z } from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { createAccount } from "@/lib/api/accounts";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { useState } from "react";

const formSchema = z.object({
  username: z.string().min(8, "Tên tài khoản phải có ít nhất 8 kí tự"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 kí tự")
    .regex(/[a-zA-Z]/, "Mật khẩu phải có ít nhất một chữ cái")
    .regex(/\d/, "Mật khẩu phải có ít nhất một chữ số"),
  role: z.string(),
});

export default function CreateUser() {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "employee",
    },
  });

  async function onSubmit(values) {
    setMessage("");
    setIsCreating(true);
    setFormData(values);
  }

  async function handleCreateAccount(values) {
    try {
      const data = await createAccount(
        values.username,
        values.password,
        values.role
      );
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="font-sans bg-white p-8 w-[400px] h-fit rounded-lg border-[1px] shadow-md flex flex-col gap-4">
      <Toaster />
      <div className="text-center text-2xl font-semibold text-gray-800 mb-1">
        Create Account
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="ExampleAccount" {...field} />
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
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full self-center bg-blue-500 hover:bg-blue-700 mt-4"
            disabled={isCreating}
          >
            Tạo
          </Button>
        </form>
      </Form>
      {isCreating && (
        <div className="fixed z-50 inset-0 bg-black/40 flex justify-center items-center">
          {message ? (
            <div className="bg-white px-16 py-6 size-fit rounded-lg gap-4 flex flex-col font-medium">
              <div className="font-semibold text-xl">{message}</div>
              <Button
                className="bg-blue-500 hover:bg-blue-700"
                onClick={() => setIsCreating(false)}
              >
                Thoát
              </Button>
            </div>
          ) : (
            <div className="bg-white p-6 size-fit rounded-lg gap-4 flex flex-col font-medium">
              <div className="font-semibold text-xl">
                Xác nhận tạo tài khoản mới với thông tin sau
              </div>
              <div>Tên tài khoản: {formData.username}</div>
              <div>Mật khẩu: {formData.password}</div>
              <div>Vai trò: {formData.role}</div>
              <div className="flex self-end gap-2">
                <Button
                  className="bg-blue-500 hover:bg-blue-700"
                  onClick={async () => await handleCreateAccount(formData)}
                >
                  Xác nhận
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-700"
                  onClick={() => setIsCreating(false)}
                >
                  Hủy
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
