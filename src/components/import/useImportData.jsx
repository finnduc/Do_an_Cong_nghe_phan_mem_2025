"use client";

import { useState, useEffect, useRef } from "react";
import { fetchImportTransaction } from "@/lib/api/import";
import { toast } from "sonner";

export function useImportData(initialData) {
  const [currentData, setCurrentData] = useState(initialData.data || []);
  const [totalPages, setTotalPages] = useState(initialData.totalPage || 0);
  const [totalRecords, setTotalRecords] = useState(initialData.total || 0);
  const [currentPage, setCurrentPage] = useState(initialData.page || 1);
  const [searchText, setSearchText] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [partnerFilter, setPartnerFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
  });

  const currentFilter = {
    transaction_id: searchText,
    employee: employeeFilter,
    partner: partnerFilter,
    priceRangeMin: priceRange[0],
    priceRangeMax: priceRange[1],
    startTime: dateFilter.startDate,
    endTime: dateFilter.endDate,
  };

  const fetchData = async (page, filters) => {
    try {
      const data = await fetchImportTransaction(page, 8, filters);
      setCurrentData(data?.metadata?.data || []);
      setTotalPages(data?.metadata?.totalPage || 0);
      setTotalRecords(data?.metadata?.total || 0);
      setCurrentPage(page);
    } catch (e) {
      toast.error(
        "An error occurred while fetching the transaction. Please try again or contact the administrator."
      );
    }
  };
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const timeout = setTimeout(() => {
      fetchData(1, currentFilter);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchText, employeeFilter, partnerFilter]);

  const applyFilters = () => {
    fetchData(1, currentFilter);
  };

  const resetFilters = () => {
    setSearchText("");
    setEmployeeFilter("");
    setPartnerFilter("");
    setPriceRange([0, 100000]);
    setDateFilter({
      startDate: null,
      endDate: null,
    });
    fetchData(1, {});
  };

  const getNextPage = (page) => {
    fetchData(page, currentFilter);
  };

  return {
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
  };
}
