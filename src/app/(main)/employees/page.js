"use client";

import React, { useState, useEffect, useCallback } from "react";
import CreateEmployeeForm from "../../../components/employees/CreateEmployee.jsx";
import ReuseTable from "@/components/ReuseTable.jsx";
import { fetchEmployees } from "@/lib/api/employee";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Ngày không hợp lệ";
  }
};

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit] = useState(9);

  const loadEmployees = useCallback(
    async (page) => {
      setIsLoading(true);
      setError(null);
      console.log(`Đang tải nhân viên trang: ${page}`);
      try {
        const response = await fetchEmployees(page, limit);
        console.log("Phản hồi API:", response);

        if (response && response.metadata) {
          setEmployees(response.metadata.data || []);
          setTotalPages(response.metadata.totalPage || 1);
          setTotalRecords(response.metadata.total || 0);
        } else {
          console.error("Cấu trúc phản hồi API không đúng:", response);
          setEmployees([]);
          setTotalPages(1);
          setTotalRecords(0);
          setError("Không thể phân tích dữ liệu nhân viên.");
        }
      } catch (err) {
        console.error("Lỗi khi tải nhân viên:", err);
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
        setEmployees([]);
        setTotalPages(1);
        setTotalRecords(0);
      } finally {
        setIsLoading(false);
      }
    },
    [limit]
  );

  useEffect(() => {
    loadEmployees(currentPage);
  }, [currentPage, loadEmployees]);

  const handlePageChange = (newPage) => {
    if (
      !isLoading &&
      newPage >= 1 &&
      newPage <= totalPages &&
      newPage !== currentPage
    ) {
      console.log(`Chuyển đến trang: ${newPage}`);
      setCurrentPage(newPage);
    }
  };

  const columns = [
    "No",
    "Name",
    "Email",
    "Phone",
    "Created_At",
    "Account",
  ];

  const rows = employees.map((emp, index) => {
    const sequentialNumber = (currentPage - 1) * limit + index + 1;
  
    return [
      sequentialNumber, 
      emp.name,
      emp.email,
      emp.phone || 'N/A',
      formatDate(emp.created_at),
      emp.username || 'Chưa có'
    ];
  });

  const refreshEmployeeList = () => {
    setCurrentPage(1);
    loadEmployees(1);
  };

  return (
    <div className="flex flex-col bg-gray-100">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
      Employee Management
      </h1>

      <div className="flex flex-col md:flex-row flex-grow gap-4 md:gap-2 md:items-start">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 shadow-lg">
          <CreateEmployeeForm onEmployeeCreated={refreshEmployeeList} />
        </div>

        <div className="flex-grow overflow-hidden">
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Đang tải dữ liệu...</p>
            </div>
          )}

          {error && !isLoading && (
            <div
              className="flex justify-center items-center h-64 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold">Lỗi!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}

          {!isLoading && !error && (
            <ReuseTable
              columns={columns}
              rows={rows}
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={totalRecords}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}
