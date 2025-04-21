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

const products = [
  {
    parameter_id: "1",
    name: "Product 1",
    category_name: "Category 1",
    manufacturer_name: "Manufacturer 1",
  },
  {
    parameter_id: "1",
    name: "Product 1",
    category_name: "Category 1",
    manufacturer_name: "Manufacturer 1",
  },
  {
    parameter_id: "1",
    name: "Product 1",
    category_name: "Category 1",
    manufacturer_name: "Manufacturer 1",
  },
  {
    parameter_id: "1",
    name: "Product 1",
    category_name: "Category 1",
    manufacturer_name: "Manufacturer 1",
  },
  {
    parameter_id: "1",
    name: "Product 1",
    category_name: "Category 1",
    manufacturer_name: "Manufacturer 1",
  },
  {
    parameter_id: "1",
    name: "Product 1",
    category_name: "Category 1",
    manufacturer_name: "Manufacturer 1",
  },
  {
    parameter_id: "1",
    name: "Product 1",
    category_name: "Category 1",
    manufacturer_name: "Manufacturer 1",
  },
  {
    parameter_id: "1",
    name: "Product 1",
    category_name: "Category 1",
    manufacturer_name: "Manufacturer 1",
  },
  {
    parameter_id: "1",
    name: "Product 1",
    category_name: "Category 1",
    manufacturer_name: "Manufacturer 1",
  },
  {
    parameter_id: "1",
    name: "Product 1",
    category_name: "Category 1",
    manufacturer_name: "Manufacturer 1",
  },
  {
    parameter_id: "1",
    name: "Product 1",
    category_name: "Category 1",
    manufacturer_name: "Manufacturer 1",
  },
  {
    parameter_id: "1",
    name: "Product 1",
    category_name: "Category 1",
    manufacturer_name: "Manufacturer 1",
  },
  {
    parameter_id: "1",
    name: "Product 1",
    category_name: "Category 1",
    manufacturer_name: "Manufacturer 1",
  },
];

export default function ParametersUI({ categories, manufacturers }) {

  return (
    <div className="flex gap-6">
      <ParametersTable title="Category" data={categories} scrollAble={true}>
        {() => (
          <div>
            <Input
              id="name"
              type="text"
              placeholder="Enter category name"
              onChange={(e) => console.log(e.target.value)}
            />
          </div>
        )}
      </ParametersTable>
      <ParametersTable
        title="Manufacturer"
        data={manufacturers}
        scrollAble={true}
      >
        {() => (
          <div>
            <Input
              id="name"
              type="text"
              placeholder="Enter manufacturer name"
              onChange={(e) => console.log(e.target.value)}
            />
          </div>
        )}
      </ParametersTable>
      <ParametersTable title="Product" data={products.slice(0, 8)}>
        {() => (
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.category_id} value={cat.category_id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Manufacturer" />
                </SelectTrigger>
                <SelectContent>
                  {manufacturers.map((man) => (
                    <SelectItem
                      key={man.manufacturer_id}
                      value={man.manufacturer_id}
                    >
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
            />
          </div>
        )}
      </ParametersTable>
    </div>
  );
}
