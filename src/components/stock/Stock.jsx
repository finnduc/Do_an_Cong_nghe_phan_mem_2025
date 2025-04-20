"use client";

import { useState, useRef } from "react";
import ReuseTable from "../ReuseTable";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Button } from "../ui/button";
import { jsonToTableFormat } from "@/lib/utils";
// Mock data
const mockProductsData = {
  data: [
    {
      product_id: 1,
      name: "Apple Watch Series 4",
      category: "Dụng cụ điện tử",
      manufacturer: "Apple",
      quantity: 50,
      import_price: 16500000,
      sell_price: 17500000,
    },
    {
      product_id: 2,
      name: "iPhone 14",
      category: "Điện thoại",
      manufacturer: "Apple",
      quantity: 100,
      import_price: 16000000,
      sell_price: 17000000,
    },
    {
      product_id: 3,
      name: "Samsung S23",
      category: "Điện thoại",
      manufacturer: "Samsung",
      quantity: 30,
      import_price: 27000000,
      sell_price: 30500000,
    },
    {
      product_id: 4,
      name: "Dell XPS",
      category: "Laptop",
      manufacturer: "Dell",
      quantity: 15,
      import_price: 55500000,
      sell_price: 60499999,
    },
    {
      product_id: 5,
      name: "Airpod",
      category: "Tai nghe",
      manufacturer: "Apple",
      quantity: 200,
      import_price: 299999,
      sell_price: 349999,
    },
    {
      product_id: 6,
      name: "Máy in HP",
      category: "Máy in",
      manufacturer: "HP",
      quantity: 40,
      import_price: 2340000,
      sell_price: 2700000,
    },
    {
      product_id: 7,
      name: "Oppo Reno 4",
      category: "Điện thoại",
      manufacturer: "Oppo",
      quantity: 20,
      import_price: 8490000,
      sell_price: 10790000,
    },
    {
      product_id: 8,
      name: "iPhone 13",
      category: "Điện thoại",
      manufacturer: "Apple",
      quantity: 30,
      import_price: 11000000,
      sell_price: 11890000,
    },
    {
      product_id: 9,
      name: "Xiaomi Redmi Note 12",
      category: "Điện thoại",
      manufacturer: "Xiaomi",
      quantity: 20,
      import_price: 3390000,
      sell_price: 3790000,
    },
  ],
  page: 1,
  totalPages: 1,
  totalRecords: 9,
  limit: 9,
};

const mockManufacturers = [
  { manufacturer_id: "1", name: "Apple" },
  { manufacturer_id: "2", name: "Samsung" },
  { manufacturer_id: "3", name: "Dell" },
  { manufacturer_id: "4", name: "HP" },
  { manufacturer_id: "5", name: "Oppo" },
  { manufacturer_id: "6", name: "Xiaomi" },
];

const mockCategories = [
  { category_id: "1", name: "Dụng cụ điện tử" },
  { category_id: "2", name: "Điện thoại" },
  { category_id: "3", name: "Laptop" },
  { category_id: "4", name: "Tai nghe" },
  { category_id: "5", name: "Máy in" },
];

export default function Stock() {
  const [manufacturerFilter, setManufacturerFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(mockProductsData.page);
  const [minQuantity, setMinQuantity] = useState(0);
  const [maxQuantity, setMaxQuantity] = useState(Infinity);
  const maxQuantityInputRef = useRef(null);
  const minQuantityInputRef = useRef(null);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [minPrice, setMinPrice] = useState(0);
  const maxPriceInputRef = useRef(null);
  const minPriceInputRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [priceTypeFilter, setPriceTypeFilter] = useState("import");
  const { columns, rows } = jsonToTableFormat(
    mockProductsData.data,
    (currentPage - 1) * mockProductsData.limit
  );

  const handleResetFilter = () => {
    setSearchText("");
    setManufacturerFilter("");
    setCategoryFilter("");
    setMinQuantity(0);
    setMaxQuantity(Infinity);
    setMinPrice(0);
    setMaxPrice(Infinity);
    maxQuantityInputRef.current.value = "";
    minQuantityInputRef.current.value = "";
    maxPriceInputRef.current.value = "";
    minPriceInputRef.current.value = "";
    setPriceTypeFilter("import");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Stock Management</h1>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        {/* Bộ lọc */}
        <div className="flex gap-4 mb-4">
          <Select
            onValueChange={(value) => setManufacturerFilter(value)}
            value={manufacturerFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Manufacturer" />
            </SelectTrigger>
            <SelectContent>
              {mockManufacturers.map((man) => (
                <SelectItem
                  key={man.manufacturer_id}
                  value={man.manufacturer_id}
                >
                  {man.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => setCategoryFilter(value)}
            value={categoryFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {mockCategories.map((cat) => (
                <SelectItem key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="text"
            className="flex-1 border border-input rounded-md px-2 shadow-sm focus:outline-none font-light text-sm"
            placeholder="Product name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <input
            type="number"
            className="w-36 flex-none border border-input rounded-md px-2 shadow-sm focus:outline-none font-light text-sm"
            placeholder="Min quantity"
            min={0}
            max={maxQuantity}
            ref={minQuantityInputRef}
            onChange={(e) => {
              if (e.target.value > maxQuantity || e.target.value < 0)
                e.target.value = maxQuantity;
              else setMinQuantity(e.target.value);
              if (e.target.value === "") setMinQuantity(0);
            }}
          />
          <input
            type="number"
            className="w-36 border border-input rounded-md px-2 shadow-sm focus:outline-none font-light text-sm"
            placeholder="Max quantity"
            min={minQuantity}
            max={Infinity}
            ref={maxQuantityInputRef}
            onChange={(e) => {
              if (e.target.value < minQuantity) {
                e.target.value = minQuantity;
              } else setMaxQuantity(e.target.value);
              if (e.target.value === "") setMaxQuantity(Infinity);
            }}
          />
          <input
            type="number"
            className="w-36 flex-none border border-input rounded-md px-2 shadow-sm focus:outline-none font-light text-sm"
            placeholder="Min price"
            min={0}
            max={maxPrice}
            ref={minPriceInputRef}
            onChange={(e) => {
              if (e.target.value > maxPrice || e.target.value < 0)
                e.target.value = maxPrice;
              else setMinPrice(e.target.value);
              if (e.target.value === "") setMinPrice(0);
            }}
          />
          <input
            type="number"
            className="w-36 border border-input rounded-md px-2 shadow-sm focus:outline-none font-light text-sm"
            placeholder="Max price"
            min={minPrice}
            max={Infinity}
            ref={maxPriceInputRef}
            onChange={(e) => {
              if (e.target.value < minPrice) {
                e.target.value = minPrice;
              } else setMaxPrice(e.target.value);
              if (e.target.value === "") setMaxPrice(Infinity);
            }}
          />
          <Select
            onValueChange={(value) => setPriceTypeFilter(value)}
            value={priceTypeFilter}
            className='focus:outline-none'
          >
            <SelectTrigger>
              <SelectValue placeholder="Price type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="import">import price</SelectItem>
              <SelectItem value="export">export price</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" onClick={handleResetFilter}>
            Reset Filter
          </Button>
        </div>
        {/* Bảng */}
        <ReuseTable
          columns={columns}
          rows={rows}
          currentPage={currentPage}
          totalPages={mockProductsData.totalPages}
          totalRecords={mockProductsData.totalRecords}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
      </div>
    </div>
  );
}
