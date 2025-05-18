// StockUI.js
"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilterPlus } from "lucide-react";
import { Toaster } from "../ui/sonner";
import { useStockData } from "./useStockData";
import StockFilter from "./StockFilter";
import StockTable from "./StockTable";
import TransactionCreator from "./TransactionCreator";
import { updateExportPrice } from "@/lib/api/stock";
import { toast } from "sonner";

export default function StockUI({
  data,
  manufacturers,
  categories,
  employees,
  partners
}) {
  const {
    currentData,
    totalPages,
    totalRecords,
    currentPage,
    searchText,
    setSearchText,
    manufacturerFilter,
    setManufacturerFilter,
    categoryFilter,
    setCategoryFilter,
    priceRange,
    setPriceRange,
    quantityRange,
    setQuantityRange,
    priceTypeFilter,
    setPriceTypeFilter,
    applyFilters,
    resetFilters,
    getNextPage,
    setEmployeeFilter,
    employeeFilter
  } = useStockData(data);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [exportPrice, setExportPrice] = useState(0);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditOpen(true);
  };

  const handleEditSubmission = async () => {
    try {
      await updateExportPrice(selectedItem.stock_id, exportPrice);
      setExportPrice(0);
      setSelectedItem(null);
      resetFilters();
      toast.success("Export price updated successfully.");
    } catch (e) {
      toast.error(
        "An error occurred while updating the export price. Please try again or contact the administrator."
      );
    }
    setIsEditOpen(false);
  };

  return (
    <div>
      <Toaster />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-2">Stock Management</h1>
      </div>
      <div className="px-4 pt-4 flex gap-10 bg-white rounded-lg border shadow-lg min-h-[570px]">
        <Tabs
          defaultValue="filter"
          className="min-w-[300px] flex flex-col gap-2"
        >
          <TabsList className="self-center">
            <TabsTrigger value="filter">
              <ListFilterPlus size={25} /> <div>Filter</div>
            </TabsTrigger>
            <TabsTrigger value="create">Create Transaction</TabsTrigger>
          </TabsList>
          <TabsContent value="filter">
            <StockFilter
              manufacturerFilter={manufacturerFilter}
              setManufacturerFilter={setManufacturerFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              quantityRange={quantityRange}
              setQuantityRange={setQuantityRange}
              priceTypeFilter={priceTypeFilter}
              setPriceTypeFilter={setPriceTypeFilter}
              applyFilters={applyFilters}
              resetFilters={resetFilters}
              manufacturers={manufacturers}
              categories={categories}
            />
          </TabsContent>
          <TabsContent value="create">
            <TransactionCreator
              currentData={currentData}
              resetFilters={resetFilters}
              employees={employees}
              setEmployeeFilter={setEmployeeFilter}
              manufacturerFilter={manufacturerFilter}
              setManufacturerFilter={setManufacturerFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              manufacturers={manufacturers}
              categories={categories}
              onRefreshData={resetFilters}
              partners={partners}
            />
          </TabsContent>
        </Tabs>
        <StockTable
          currentData={currentData}
          totalPages={totalPages}
          totalRecords={totalRecords}
          currentPage={currentPage}
          getNextPage={getNextPage}
          searchText={searchText}
          setSearchText={setSearchText}
          onEdit={handleEdit}
        />
      </div>
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg border shadow-md p-4">
            <div className="text-center font-semibold text-xl">
              Edit stock export price
            </div>
            <label htmlFor="exportPrice">Enter the new export price:</label>
            <input
              id="exportPrice"
              type="number"
              className="border border-gray-300 rounded-md p-2"
              min={0}
              value={exportPrice}
              onChange={(e) => {
                if (e.target.value < 0) {
                  setExportPrice(0);
                } else {
                  setExportPrice(e.target.value);
                }
              }}
            />
            <div className="flex justify-end mt-4">
              <button
                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md mr-2"
                onClick={() => {
                  setIsEditOpen(false);
                  setExportPrice("");
                  setSelectedItem(null);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                onClick={handleEditSubmission}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
