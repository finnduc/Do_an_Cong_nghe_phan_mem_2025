"use client";
import { useState, useRef, useEffect } from "react";
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
import { ListFilterPlus } from "lucide-react";
import SearchBar from "../SearchBar";

export default function StockUI({ data, manufacturers, categories }) {
  const [currentData, setCurrentData] = useState(data.data);
  const [totalPages, setTotalPages] = useState(data.totalPage);
  const [totalRecords, setTotalRecords] = useState(data.totalItem);
  const [manufacturerFilter, setManufacturerFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(data.page);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [quantityRange, setQuantityRange] = useState([0, 100000]);
  const [searchText, setSearchText] = useState("");
  const [priceTypeFilter, setPriceTypeFilter] = useState("import");
  const formattedData = jsonToTableFormat(currentData, currentPage);
  const currentFilter = {
    product_name: searchText,
    manufacturer: manufacturerFilter,
    category_name: categoryFilter,
    priceMin: priceRange[0],
    priceMax: priceRange[1],
    quantityMin: quantityRange[0],
    quantityMax: quantityRange[1],
    action: priceTypeFilter,
  };

  const handleResetFilter = () => {
    setSearchText("");
    setManufacturerFilter("");
    setCategoryFilter("");
    setPriceTypeFilter("import");
    setPriceRange([0, 100000]);
    setQuantityRange([0, 100000]);
    setCurrentPage(1);
    setCurrentData(data.data);
    setTotalPages(data.totalPage);
    setTotalRecords(data.totalItem);
  };

  const getNextPage = async (page) => {
    try {
      const data = await fetchStock(page, 8, currentFilter);
      setCurrentData(data?.metadata?.data);
      setCurrentPage(page);
    } catch (e) {
      setErrorMessage(e.message || "Đã xảy ra lỗi không xác định.");
      toast.error(
        "Có lỗi xảy ra khi tạo truy vấn SQL. Vui lòng thử lại hoặc liên hệ với người quản trị."
      );
    }
  };

  const handleApplyFilter = async () => {
    try {
      const data = await fetchStock(1, 8, currentFilter);
      setCurrentData(data?.metadata?.data);
      setCurrentPage(1);
      setTotalPages(data?.metadata?.totalPage);
      setTotalRecords(data?.metadata?.totalItem);
    } catch (e) {
      setErrorMessage(e.message || "Đã xảy ra lỗi não xác định.");
      toast.error(
        "Có lỗi xảy ra khi tạo truy vấn SQL. Vui lòng thử lagi hoặc liên hệ với người quản trị."
      );
    }
  };

  const isFirstRun = useRef(true);

useEffect(() => {
  if (isFirstRun.current) {
    isFirstRun.current = false;
    return; // Bỏ qua lần đầu
  }

  const timeout = setTimeout(() => {
    handleApplyFilter();
  }, 300);

  return () => clearTimeout(timeout); // cleanup nếu searchText thay đổi quá nhanh
}, [searchText]);

  return (
    <div>
      <Toaster />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-2">Stock Management</h1>
      </div>
      <div className="px-4 pt-4 flex gap-10 bg-white rounded-lg border shadow-lg h-[570px]">
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
                  <SelectItem key={cat.category_id} value={cat.name}>
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
                    value={man.name}
                  >
                    {man.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-gray-600">
            <div>Quantity range:</div>
            <DualRangeSlider
              value={quantityRange}
              onValueChange={(value) => setQuantityRange(value)}
            />
          </div>
          <div className="text-sm text-gray-600">
            <div>Price range:</div>
            <DualRangeSlider
              value={priceRange}
              onValueChange={(value) => setPriceRange(value)}
            />
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
            <Button
              className="text-white bg-blue-500 hover:bg-blue-700"
              onClick={handleApplyFilter}
            >
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
          <SearchBar
            value={searchText}
            onValueChange={(e) => setSearchText(e.target.value)}
          />
          <ReuseTable
            columns={formattedData.columns}
            rows={formattedData.rows}
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onPageChange={getNextPage}
            maxLength={25}
          />
        </div>
      </div>
    </div>
  );
}
