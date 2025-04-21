"use client";
import { jsonToTableFormat } from "@/lib/utils";
import ReuseTable from "../ReuseTable";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ParametersTable from "./ParametersTable";

const catergories = [
  {category_id : "1", name: "Category 1", created_at: "2023-01-01"},
  {category_id : "2", name: "Category 2", created_at: "2023-01-01"},
  {category_id : "3", name: "Category 3", created_at: "2023-01-01"},
  {category_id : "4", name: "Category 4", created_at: "2023-01-01"},
  {category_id : "5", name: "Category 5", created_at: "2023-01-01"},
  {category_id : "6", name: "Category 6", created_at: "2023-01-01"},
  {category_id : "7", name: "Category 7", created_at: "2023-01-01"},
  {category_id : "8", name: "Category 8", created_at: "2023-01-01"},
  {category_id : "9", name: "Category 9", created_at: "2023-01-01"},
  {category_id : "10", name: "Category 10", created_at: "2023-01-01"},
  {category_id : "11", name: "Category 11", created_at: "2023-01-01"},
  {category_id : "12", name: "Category 12", created_at: "2023-01-01"},
  {category_id : "13", name: "Category 13", created_at: "2023-01-01"},
];

const manufacturers = [
  {manufacturer_id : "1", name: "Manufacturer 1", created_at: "2023-01-01"},
  {manufacturer_id : "2", name: "Manufacturer 2", created_at: "2023-01-01"},
  {manufacturer_id : "3", name: "Manufacturer 3", created_at: "2023-01-01"},
  {manufacturer_id : "4", name: "Manufacturer 4", created_at: "2023-01-01"},
  {manufacturer_id : "5", name: "Manufacturer 5", created_at: "2023-01-01"},
  {manufacturer_id : "6", name: "Manufacturer 6", created_at: "2023-01-01"},
  {manufacturer_id : "7", name: "Manufacturer 7", created_at: "2023-01-01"},
  {manufacturer_id : "8", name: "Manufacturer 8", created_at: "2023-01-01"},
  {manufacturer_id : "9", name: "Manufacturer 9", created_at: "2023-01-01"},    
  {manufacturer_id : "10", name: "Manufacturer 10", created_at: "2023-01-01"},    
  {manufacturer_id : "11", name: "Manufacturer 11", created_at: "2023-01-01"},    
  {manufacturer_id : "12", name: "Manufacturer 12", created_at: "2023-01-01"},    
  {manufacturer_id : "13", name: "Manufacturer 13", created_at: "2023-01-01"},
];

export default function ParametersUI() {
  return (
    <div className="flex gap-6">
      <ParametersTable title="Category" data={catergories.slice(0, 8)} />
      <ParametersTable title="Manufacturer" data={manufacturers.slice(0, 8)} />
    </div>
  );
}
