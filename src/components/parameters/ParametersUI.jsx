"use client";
import { jsonToTableFormat } from "@/lib/utils";
import ReuseTable from "../ReuseTable";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ParametersTable from "./ParametersTable";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { updateCategory } from "@/lib/api/parameters";

export default function ParametersUI({ categories, manufacturers, products }) {
  const handleEditCategory = async (id, name) => {
    try {
      const updatedCategory = await updateCategory(id, name);
      console.log(updatedCategory);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="flex gap-6">
      <ParametersTable title="Category" data={categories} scrollAble={true} handleCreateParameters={handleEditCategory}>
        {({ item, index }) => (
          <div>
            <Input
              id="name"
              type="text"
              placeholder="Enter category name"
              onChange={(e) => console.log(e.target.value)}
              defaultValue={item?.name}
            />
          </div>
        )}
      </ParametersTable>
      <ParametersTable
        title="Manufacturer"
        data={manufacturers}
        scrollAble={true}
      >
        {({ item, index }) => (
          <div>
            <Input
              id="name"
              type="text"
              placeholder="Enter manufacturer name"
              onChange={(e) => console.log(e.target.value)}
              defaultValue={item?.name}
            />
          </div>
        )}
      </ParametersTable>
      <ParametersTable title="Product" data={products.slice(0, 8)}>
        {({ item, index }) => (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Select
                defaultValue={
                  item
                    ? categories.filter((c) => c.name === item.category_name)[0]
                        .name
                    : undefined
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.category_id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                defaultValue={
                  item
                    ? manufacturers.filter(
                        (m) => m.name === item.manufacturer_name
                      )[0].name
                    : undefined
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Manufacturer" />
                </SelectTrigger>
                <SelectContent>
                  {manufacturers.map((man) => (
                    <SelectItem key={man.manufacturer_id} value={man.name}>
                      {man.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              id="name"
              type="text"
              placeholder="Enter product name"
              onChange={(e) => console.log(e.target.value)}
              defaultValue={item?.product_name}
            />
          </div>
        )}
      </ParametersTable>
    </div>
  );
}
