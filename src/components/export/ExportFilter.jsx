"use client";
import { Button } from "../ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import DualRangeSlider from "../ui/slider";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TransactionFieldCombobox from "../stock/TransactionFieldCombobox";

const filterSchema = z.object({
  employeeId: z.string().optional(),
  partnerId: z.string().optional(),
  priceRange: z.tuple([z.number(), z.number()]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export default function ExportFilter({
  employees = [],
  customers = [],
  onFilterSubmit,
  onReset,
  disabled = false,
}) {
  const form = useForm({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      employeeId: "",
      partnerId: "",
      priceRange: [0, 100000],
      startDate: "",
      endDate: "",
    },
  });

  const handleSubmit = (values) => {
    onFilterSubmit(values);
  };

  const handleReset = () => {
    form.reset();
    onReset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 w-full max-w-full pb-4">
        {/* Employee */}
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee</FormLabel>
              <FormControl>
                <TransactionFieldCombobox
                  items={employees}
                  valueField="employee_id"
                  labelField="name"
                  inputValue={field.value}
                  setInputValue={field.onChange}
                  placeholder="Select employee"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Partner */}
        <FormField
          control={form.control}
          name="partnerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Partner</FormLabel>
              <FormControl>
                <TransactionFieldCombobox
                  items={customers}
                  valueField="partner_id"
                  labelField="name"
                  inputValue={field.value}
                  setInputValue={field.onChange}
                  placeholder="Select partner"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price range */}
        <FormField
          control={form.control}
          name="priceRange"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price range</FormLabel>
              <FormControl>
                <DualRangeSlider value={field.value} onValueChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Date */}
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Date */}
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-4">
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white"
            disabled={disabled}
          >
            Apply
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full border"
            onClick={handleReset}
            disabled={disabled}
          >
            Reset Filter
          </Button>
        </div>
      </form>
    </Form>
  );
}