import { useState } from "react";
import { fetchImportTransaction } from "@/lib/api/import";

export function useImportData(initialData) {
  const [currentData, setCurrentData] = useState(initialData?.data || []);
  const [totalPages, setTotalPages] = useState(initialData?.totalPage || 1);
  const [totalRecords, setTotalRecords] = useState(initialData?.totalItem || 0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async (page, filters = {}) => {
    const cleaned = {
      ...filters,
      page,
      limit: 9,
      action: "import",
    };
    const res = await fetchImportTransaction(cleaned);
    setCurrentData(res?.metadata?.data || []);
    setTotalPages(res?.metadata?.totalPage || 1);
    setTotalRecords(res?.metadata?.totalItem || 0);
    setCurrentPage(page);
  };

  const applyFilters = (filters) => fetchData(1, {
    employee: filters.employeeId || undefined,
    partner: filters.partnerId || undefined,
    price_min: filters.priceRange?.[0],
    price_max: filters.priceRange?.[1],
    start_date: filters.startDate,
    end_date: filters.endDate
  });

  const resetFilters = () => fetchData(1);

  const getNextPage = (page) => fetchData(page);

  return {
    currentData,
    totalPages,
    totalRecords,
    currentPage,
    applyFilters,
    resetFilters,
    getNextPage,
  };
}
