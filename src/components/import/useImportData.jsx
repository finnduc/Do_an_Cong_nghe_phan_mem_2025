"use client";
import { useEffect, useState, useRef } from "react";
import { fetchImportTransaction } from "@/lib/api/import";
import { toast } from "sonner";

export function useImportData(initialData) {
  const [currentData, setCurrentData] = useState(initialData?.data || []);
  const [totalPages, setTotalPages] = useState(initialData?.totalPage || 1);
  const [totalRecords, setTotalRecords] = useState(initialData?.total || 0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState({ action: "import" });
  const isFirstRun = useRef(true);

  const fetchData = async (page = 1, customFilter = filter) => {
    const cleaned = Object.fromEntries(
      Object.entries(customFilter).filter(([_, v]) => v !== undefined && v !== "")
    );
    try {
      const res = await fetchImportTransaction({ page, limit: 6, ...cleaned });
      setCurrentData(res?.metadata?.data || []);
      setTotalPages(res?.metadata?.totalPage || 1);
      setTotalRecords(res?.metadata?.total || 0);
      setCurrentPage(page);
    } catch (err) {
      toast.error("Lỗi khi tải dữ liệu nhập kho");
      console.error(err);
    }
  };

  const applyFilters = (filters) => {
    const newFilter = {
      employee: filters.employee || undefined,
      partner: filters.partner || undefined,
      startTime: filters.startTime || undefined,
      endTime: filters.endTime || undefined,
      priceMin: filters.priceMin || undefined,
      priceMax: filters.priceMax || undefined,
      action: "import",
    };
    setFilter(newFilter);
    fetchData(1, newFilter);
  };

  const resetFilters = () => {
    const reset = { action: "import" };
    setFilter(reset);
    fetchData(1, reset);
  };

  const getNextPage = (page) => {
    fetchData(page);
  };

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    fetchData(1);
  }, []);

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
