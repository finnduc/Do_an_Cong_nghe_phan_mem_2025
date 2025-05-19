// src/app/(main)/employees/page.js
"use client";
import React, { useState, useEffect, useCallback } from "react";
import EmployeeUI from "../../../components/employees/TableEmployee";
import { fetchEmployees, searchEmployees } from "../../../lib/api/employee";
import CreateEmployeeForm from "../../../components/employees/CreateEmployee";
import SearchBar from "../../../components/SearchBar";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function EmployeePage() {
  const [employeeData, setEmployeeData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const limit = 9; // Đã đổi thành 8 theo yêu cầu trước

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const loadEmployees = useCallback(
    async (page = 1, search = debouncedSearchTerm) => {
      if (
        page !== currentPage ||
        (search !== debouncedSearchTerm && search !== "") ||
        (page === 1 && search === "" && !employeeData.length)
      ) {
        setIsLoading(true);
      }
      setError(null);
      try {
        let response;
        if (search.trim() !== "") {
          response = await searchEmployees(search, page, limit);
        } else {
          response = await fetchEmployees(page, limit);
        }

        if (response && response.metadata) {
          setEmployeeData(response.metadata.data || []);
          setTotalPages(response.metadata.totalPage || 1);
          setTotalRecords(response.metadata.total || 0);
          setCurrentPage(page);
        } else {
          setEmployeeData([]);
          setTotalPages(1);
          setTotalRecords(0);
          setCurrentPage(1);
          throw new Error("Failed to fetch employee data or invalid format.");
        }
      } catch (err) {
        console.error(
          `Error fetching employees (page ${page}, search '${search}'):`,
          err
        );
        setError(err.message || "Could not load employee data.");
        setEmployeeData([]);
        setTotalPages(1);
        setTotalRecords(0);
        setCurrentPage(1);
      } finally {
        setIsLoading(false);
      }
    },
    [limit, currentPage, debouncedSearchTerm, employeeData.length]
  );

  useEffect(() => {
    loadEmployees(1, debouncedSearchTerm);
  }, [debouncedSearchTerm, loadEmployees]); // loadEmployees được thêm vào đây vì nó là dependency

  useEffect(() => {
    setInputPage(currentPage);
  }, [currentPage]);

  const handleCreateSuccess = () => {
    setSearchTerm("");
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      loadEmployees(newPage, debouncedSearchTerm);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleInputPageChange = (e) => {
    setInputPage(e.target.value);
  };

  const handleGoToPage = () => {
    const pageNum = parseInt(inputPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      handlePageChange(pageNum);
    } else {
      setInputPage(currentPage);
      toast.info(`Please enter a page number between 1 and ${totalPages}.`);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Nhóm Tiêu đề và SearchBar vào một div với flex */}
      <div className="flex items-center mb-2">
        {" "}
        {/* Bỏ justify-between, dùng gap hoặc margin để tạo khoảng cách */}
        <h1 className="text-2xl font-semibold text-gray-800 mr-14">
          {" "}
          {/* Thêm mr-4 (margin-right) cho tiêu đề */}
          Employee Management
        </h1>
        <div className="w-full max-w-xs sm:max-w-sm ">
          {" "}
          {/* Kích thước cho SearchBar */}
          <SearchBar
            value={searchTerm}
            placeholderText="Employee name"
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
          <CreateEmployeeForm onSuccess={handleCreateSuccess} />
        </div>
        <div className="flex-grow overflow-hidden flex flex-col">
          {isLoading ? (
            <div className="p-4 text-center text-lg">Loading employees...</div>
          ) : !error && employeeData.length > 0 ? (
            <EmployeeUI initialData={employeeData} />
          ) : !isLoading && !error && employeeData.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-lg">
              No employees found
              {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}.
            </div>
          ) : null}

          
        </div>
      </div>
    </div>
  );
}
