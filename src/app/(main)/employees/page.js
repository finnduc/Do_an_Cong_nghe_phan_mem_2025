"use client";

import React, { useState, useEffect, useCallback } from "react";
import EmployeeUI from "../../../components/employees/TableEmployee";
import { fetchEmployees, searchEmployees } from "../../../lib/api/employee";
import CreateEmployeeForm from "../../../components/employees/CreateEmployee";
import SearchBar from "../../../components/SearchBar";
import Loading from "../loading";

export default function EmployeePage() {
  const [employeeData, setEmployeeData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const limit = 9;

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); 

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  const loadEmployees = useCallback(async (page, search) => {
    setIsLoading(true);
    setError(null);
    try {
      let response;
      if (search) {
        response = await searchEmployees(search, page, limit);
        console.log("Search API Response:", response);
      } else {
        response = await fetchEmployees(page, limit);
      }

      if (response && response.metadata) {
        const isSearchResponse = Array.isArray(response.metadata);
        const employees = isSearchResponse ? response.metadata : response.metadata.data || [];
        const pages = isSearchResponse ? 1 : response.metadata.totalPage || 1;
        const records = isSearchResponse ? employees.length : response.metadata.total || 0;

        setEmployeeData(employees);
        setTotalPages(pages);
        setTotalRecords(records);
        setCurrentPage(page);
        
      } else {
        throw new Error("Failed to fetch employee data or invalid format.");
      }
    } catch (err) {
      toast.error("Could not load employee data.")
      setEmployeeData([]);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadEmployees(1, debouncedSearchTerm);
  }, [debouncedSearchTerm, loadEmployees]);

  const handleActionSuccess = () => {
    loadEmployees(currentPage, debouncedSearchTerm);
  };

  const handlePageChange = (newPage) => {
    if (newPage !== currentPage) {
      loadEmployees(newPage, debouncedSearchTerm);
    }
  };
  
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-2">
        <h1 className="text-2xl font-semibold text-gray-800 mr-14">
          Employee Management
        </h1>
        <div className="w-full max-w-xs sm:max-w-sm ">
          <SearchBar
            placeholderText="Employee name"
            value={searchTerm}
            onValueChange={handleSearchChange}
          />
        </div>
      </div>
      
      {error && !isLoading && (
        <div className="text-red-500 p-4 bg-red-100 border border-red-400 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row flex-grow gap-4 md:gap-2 md:items-start">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 shadow-md">
          <CreateEmployeeForm onSuccess={handleActionSuccess} />
        </div>
        <div className="flex-grow overflow-hidden">
          {isLoading ? (
            <Loading /> 
          ) : (
            <EmployeeUI
              initialData={employeeData}
              initialTotalPages={totalPages}
              initialTotalRecords={totalRecords}
              onActionSuccess={handleActionSuccess}
              onPageChange={handlePageChange}
              currentPage={currentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}