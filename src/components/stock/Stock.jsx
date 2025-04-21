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
import DualRangeSlider from "../ui/slider";
import { Search, ListFilterPlus } from "lucide-react";

export default function Stock({ data, manufacturers, categories }) {
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
    category_name: categoryFilter,
    quantityMin: minQuantity,
    quantityMax: maxQuantity,
    priceMin: minPrice,
    priceMax: maxPrice,
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-2">Stock Management</h1>
      </div>
      <div className="px-4 pt-4 flex gap-10 bg-white rounded-lg border shadow-lg">
        {/* Bộ lọc */}
        <div className="flex flex-col gap-6 h-fit max-w-[300px]">
          <div className="flex items-center gap-2 text-xl font-semibold font-sans">
            <ListFilterPlus size={25} /> <div>Filter</div>
          </div>
          <div className="flex gap-2">
            <Select
              onValueChange={(value) => setCategoryFilter(value)}
              value={categoryFilter}
            >
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
            <Select
              onValueChange={(value) => setManufacturerFilter(value)}
              value={manufacturerFilter}
            >
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
          <div className="text-sm text-gray-600">
            <div>Quantity range:</div>
            <DualRangeSlider />
          </div>
          <div className="text-sm text-gray-600">
            <div>Price range:</div>
            <DualRangeSlider />
          </div>
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
          <div className="flex flex-col gap-2">
            <Button className="text-white bg-blue-500 hover:bg-blue-700">
              Apply
            </Button>
            <Button
              variant="ghost"
              className="border"
              onClick={handleResetFilter}
            >
              Reset Filter
            </Button>
          </div>
        </div>
        {/* Bảng */}
        <div>
          <div className="flex items-center bg-blue-500 w-fit rounded-sm mb-2 shadow-sm">
            <Search className="py-1 px-2 text-white" size={30} />
            <input
              type="text"
              className="border-input border rounded-r-sm p-2 focus:outline-none font-light text-sm"
              placeholder="Product name"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
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
    </div>
  );
}
