"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilterPlus } from "lucide-react";
import { Toaster } from "../ui/sonner";
import { useExportData } from "./useExportData";
import ExportFilter from "./ExportFilter";
import TransactionTable from "./ExportTransactionTable";

export default function ExportUI({ data, customers, employees }) {
  const {
    currentData,
    totalPages,
    totalRecords,
    currentPage,
    applyFilters,
    resetFilters,
    getNextPage,
  } = useExportData(data, 9);

  return (
    <div>
      <Toaster />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-2">Export Management</h1>
      </div>
      <div className="px-4 pt-4 flex gap-6 bg-white rounded-lg border shadow-lg min-h-[570px]">
        <div className="w-[300px] pr-2">
          <Tabs defaultValue="filter" className="flex flex-col gap-2">
            <TabsList className="self-center">
              <TabsTrigger value="filter">
                <ListFilterPlus size={20} /> <span className="ml-1">Filter</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="filter">
              <ExportFilter
                employees={employees}
                customers={customers} // customers = partner_type: 'customer'
                onFilterSubmit={applyFilters}
                onReset={resetFilters}
                disabled={false}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-1">
          <TransactionTable
            columns={["Transaction id", "Employee", "Partner", "Note", "Total amount", "Created at"]}
            rows={currentData.map((item) => ({
              data: [
                item.header_id,
                item.employee_name || item.employee_id,
                item.partner_name || item.partner_id,
                item.notes || "-",
                item.total_amount,
                item.created_at,
              ],
              items: item.items?.map((detail) => [
                detail.product_name,
                detail.category,
                detail.manufacturer,
                detail.quantity?.toString() ?? "",
                detail.price_per_unit?.toString() ?? "",
                detail.total?.toString() ?? "",
              ]) || [],
            }))}
            itemColumns={["Product name", "Category", "Manufacturer", "Quantity", "Price per unit", "Total"]}
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