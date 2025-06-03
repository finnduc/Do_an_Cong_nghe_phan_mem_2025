"use client";

import { useState, useEffect, useRef } from "react";
import { fetchExportTransaction } from "@/lib/api/export";
import { toast } from "sonner";

export function useExportData(initialData) {
  const [currentData, setCurrentData] = useState(initialData.data || []);
  const [totalPages, setTotalPages] = useState(initialData.totalPage || 0);
  const [totalRecords, setTotalRecords] = useState(initialData.totalItem || 0);
  const [currentPage, setCurrentPage] = useState(initialData.page || 1);
  const [setTransaction] = useState([]);
  const [transactionFilter, setTransactionFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [partnerFilter, setPartnerFilter] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null,
  });

  const currentFilter = {
    header_id: searchText,
    employee: employeeFilter,
    partner: partnerFilter,
    priceRangeMin: priceRange[0],
    priceRangeMax: priceRange[1],
    start_date: dateFilter.startDate,
    end_date: dateFilter.endDate,
  };

  const fetchData = async (page, filters) => {
    try {
      const data = await fetchExportTransaction(page, 8, filters);
      setTransaction(data?.metadata?.data || []);
      setCurrentData(data?.metadata?.data || []);
      setTotalPages(data?.metadata?.totalPage || 0);
      setTotalRecords(data?.metadata?.totalItem || 0);
      setCurrentPage(page);
    } catch (e) {
      toast.error('An error occurred while fetching the transaction. Please try again or contact the administrator.');
    }
  };

  const fetchTransactionByID = async () => {
    try {
      const data = await fetchExportTransaction(1, 8, { header_id: transactionFilter });
      setTransaction(data?.metadata?.data || []);
    } catch (e) {
      toast.error('An error occurred while fetching the transaction. Please try again or contact the administrator.');
    }
  }

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchTransactionByID();
    }, 300);
    return () => clearTimeout(timeout);
  }, [transactionFilter]);


  const applyFilters = () => {
    fetchData(1, currentFilter);
  };

  const resetFilters = () => {
    setSearchText('');
    setEmployeeFilter('');
    setPartnerFilter('');
    setTransactionFilter('');
    setPriceRange([0, 100000]);
    setDateFilter({
      startTime: null,
      endTime: null,
    });
    fetchData(1, {
      header_id: '',
      employee: '',
      partner: '',
      priceRangeMin: priceRange[0],
      priceRangeMax: priceRange[1],
      start_date: dateFilter.startDate,
      end_date: dateFilter.endDate,
    });
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
    filterError,
    setFilterError,
    applyFilters,
    resetFilters,
    getNextPage,
  };
}