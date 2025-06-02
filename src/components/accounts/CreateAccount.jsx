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
  username: z.string().min(8, "Username must be at least 8 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/\d/, "Password must contain at least one number"),
  role_id: z.string().min(1, "Please select a role"),
});


export default function CreateUser({ roleData, onSuccess }) {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      role_id: "",
    },
  });

  async function onSubmit(values) {
    setMessage("");
    setFormData(values);
    setIsCreating(true); // Mở modal
  }

  async function handleCreateAccount(values) {
    try {
      const data = await createAccount(
        values.username,
        values.password,
        values.role_id
      );
      setMessage("The account has been created successfully.");
      onSuccess();
    } catch (error) {
      setMessage(error.message || "An error occurred while creating the account. Please try again or contact the administrator.");
      toast.error(error.message || "An error occurred while creating the account. Please try again or contact the administrator.");
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
            name="role_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roleData.map((role) => (
                      <SelectItem key={role.role_id} value={role.role_id}>
                        {role.name}
                      </SelectItem>
                    ))}
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
            Create
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
                onClick={() => {
                  setIsCreating(false);
                }}
              >
                Close
              </Button>
            </div>
          ) : (
            <div className="bg-white p-6 size-fit rounded-lg gap-4 flex flex-col font-medium">
              <div className="font-semibold text-xl">
                Confirm account information
              </div>
              <div>Username: {formData.username}</div>
              <div>Password: {formData.password}</div>
              <div>
                Role:{" "}
                {roleData.find((item) => item.role_id === formData.role_id)
                  ?.name || "N/A"}
              </div>
              <div className="flex self-end gap-2">
                <Button
                  className="bg-blue-500 hover:bg-blue-700"
                  onClick={async () => await handleCreateAccount(formData)}
                >
                  Confirm
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-700"
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
