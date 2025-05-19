"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilterPlus } from "lucide-react";
import { Toaster } from "../ui/sonner";
import { useImportData } from "./useImportData";
import ImportFilter from "./ImportFilter";
import ImportTransactionTable from "./ImportTransactionTable";

export default function ImportUI({ data, suppliers, employees }) {
  const {
    currentData,
    totalPages,
    totalRecords,
    currentPage,
    applyFilters,
    resetFilters,
    getNextPage,
  } = useImportData(data, 9);

  return (
    <div>
      <Toaster />
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-2">Import Management</h1>
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
              <ImportFilter
                employees={employees}
                suppliers={suppliers} // suppliers = partner_type: 'supplier'
                onFilterSubmit={applyFilters}
                onReset={resetFilters}
                disabled={false}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-1">
          <ImportTransactionTable
            data={currentData}
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
