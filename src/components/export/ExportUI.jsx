"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListFilterPlus } from "lucide-react";
import { Toaster } from "../ui/sonner";
import { useExportData } from "./useExportData";
import ExportFilter from "./ExportFilter";
import ExportTable from "./ExportTable";

export default function ExportUI({ data, employees, partners }) {
  const {
    currentData,
    totalPages,
    totalRecords,
    currentPage,
    searchText,
    setSearchText,
    employeeFilter,
    setEmployeeFilter,
    partnerFilter,
    setPartnerFilter,
    priceRange,
    setPriceRange,
    dateFilter,
    setDateFilter,
    applyFilters,
    resetFilters,
    getNextPage,
  } = useExportData(data);

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
                employeeFilter={employeeFilter}
                setEmployeeFilter={setEmployeeFilter}
                partnerFilter={partnerFilter}
                setPartnerFilter={setPartnerFilter}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                dateFilter={dateFilter}
                setDateFilter={setDateFilter}
                applyFilters={applyFilters}
                resetFilters={resetFilters}
                employees={employees}
                partners={partners}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-1">
          <ExportTable
            currentData={currentData}
            totalPages={totalPages}
            totalRecords={totalRecords}
            currentPage={currentPage}
            getNextPage={getNextPage}
            searchText={searchText}
            setSearchText={setSearchText}
          />
        </div>
      </div>
    </div>
  );
}