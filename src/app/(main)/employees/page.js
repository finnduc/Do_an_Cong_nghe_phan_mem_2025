// src/app/(main)/employees/page.js
"use client"; // <-- BẮT BUỘC: Chuyển thành Client Component

// --- Thêm import ---
import React, { useState, useEffect, useCallback } from "react";
import EmployeeUI from "../../../components/employees/TableEmployee"; // Component bảng
import { fetchEmployees } from "../../../lib/api/employee"; // API lấy danh sách
import CreateEmployeeForm from "../../../components/employees/CreateEmployee"; // Component form
import SearchBar from "../../../components/SearchBar";

export default function EmployeePage() {
  // --- Thêm State để quản lý dữ liệu phía client ---
  const [employeeData, setEmployeeData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 9;
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const loadEmployees = useCallback(
    async (page = 1) => {
      if (page === 1) setIsLoading(true); // Chỉ hiện loading xoay tròn khi load trang đầu
      setError(null);
      try {
        // Gọi fetchEmployees không có search
        const response = await fetchEmployees(page, limit);
        if (response && response.metadata) {
          setEmployeeData(response.metadata.data || []);
          setTotalPages(response.metadata.totalPage || 1);
          setTotalRecords(response.metadata.total || 0);
          setCurrentPage(page);
        } else {
          throw new Error("Failed to fetch employee data or invalid format.");
        }
      } catch (err) {
        console.error(`Error fetching employees (page ${page}):`, err);
        setError(err.message || "Could not load employee data.");
        setEmployeeData([]);
        setTotalPages(1);
        setTotalRecords(0);
      } finally {
        // Luôn tắt loading sau khi fetch xong trang 1
        if (page === 1) setIsLoading(false);
      }
    },
    [limit]
  ); // Phụ thuộc vào limit
  // -----------------------------------------

  // --- Fetch dữ liệu lần đầu khi component mount ---
  useEffect(() => {
    loadEmployees(1);
  }, [loadEmployees]); // Thêm loadEmployees vào dependency array
  // -----------------------------------------
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Thời gian debounce 500ms

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // --- Hàm xử lý khi tạo nhân viên thành công ---
  const handleCreateSuccess = () => {
    console.log("Employee created successfully, refreshing list...");
    // Dùng router.refresh() để yêu cầu Next.js fetch lại data cho route này
    loadEmployees(1, "");
  };
  // -----------------------------------------
  const handleActionSuccess = () => {
    loadEmployees(1, ""); // Tải lại từ trang đầu tiên
  };
  // --- Hàm xử lý chuyển trang (nếu bảng EmployeeUI cần) ---
  const handlePageChange = (newPage) => {
    loadEmployees(newPage);
  };
  // -------------------------------------------------

  // --- Giữ nguyên cấu trúc JSX và CSS gốc ---
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
          <SearchBar placeholderText="Employee name" />
        </div>
      </div>
      {error &&
        !isLoading && ( // Hiển thị lỗi nếu có và không loading
          <div className="text-red-500 p-4 bg-red-100 border border-red-400 rounded mb-4">
            {error}
          </div>
        )}
      <div className="flex flex-col md:flex-row flex-grow gap-4 md:gap-2 md:items-start">
        {" "}
        {/* Giữ class gốc */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 shadow-md">
          {" "}
          {/* Giữ class gốc */}
          {/* Truyền hàm handleCreateSuccess vào prop onSuccess của Form */}
          <CreateEmployeeForm onSuccess={handleCreateSuccess} />
        </div>
        <div className="flex-grow overflow-hidden">
          {" "}
          {/* Giữ class gốc */}
          {/* Bỏ phần SearchBar */}
          {isLoading ? (
            <div className="p-4 text-center">Loading employees...</div> // Thêm trạng thái loading
          ) : !error ? (
            // Truyền dữ liệu từ state vào bảng
            <EmployeeUI
              initialData={employeeData} // Dùng state employeeData
              initialTotalPages={totalPages} // Dùng state totalPages
              initialTotalRecords={totalRecords} // Dùng state totalRecords
              // Nếu EmployeeUI/TableEmployee cần 2 props này để phân trang đúng, hãy bỏ comment
              // currentPage={currentPage}
              // onPageChange={handlePageChange}
              onActionSuccess={handleActionSuccess}
            />
          ) : null}{" "}
          {/* Không hiển thị gì nếu lỗi và không loading */}
        </div>
      </div>
    </div>
  );
}
