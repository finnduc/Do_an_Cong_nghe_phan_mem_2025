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
import { fetchStock } from "@/lib/api/stock";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";

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

export default function Stock({ data }) {
  const [currentData, setCurrentData] = useState(data.data);
  const [totalPages, setTotalPages] = useState(data.totalPage);
  const [totalRecords, setTotalRecords] = useState(data.totalItem);
  const [manufacturerFilter, setManufacturerFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(data.page);
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
  const formattedData = jsonToTableFormat(currentData, currentPage);
  const currentFilter = {
    manufacturer: manufacturerFilter,
    category: categoryFilter,
    minQuantity: minQuantity,
    maxQuantity: maxQuantity,
    minPrice: minPrice,
    maxPrice: maxPrice,
    action: priceTypeFilter,
  };

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

  const getNextPage = async (page) => {
    try {
      const data = await fetchStock(page, 8, currentFilter);
      console.log(data);
      setCurrentData(data?.metadata?.data);
      setCurrentPage(page);
    } catch (e) {
      setErrorMessage(e.message || "Đã xảy ra lỗi không xác định.");
      toast.error(
        "Có lỗi xảy ra khi tạo truy vấn SQL. Vui lòng thử lại hoặc liên hệ với người quản trị."
      );
    }
  };

  return (
    <div>
      <Toaster />
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
            className="focus:outline-none"
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
          columns={formattedData.columns}
          rows={formattedData.rows}
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={totalRecords}
          onPageChange={getNextPage}
        />
      </div>
    </div>
  );
}
