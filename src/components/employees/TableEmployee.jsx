"use client";
import { useState, useEffect } from "react";
import ReuseTable from "../ReuseTable";
import { jsonToTableFormat } from "@/lib/utils";
import { fetchEmployees } from "@/lib/api/employee";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import addEditButtons from "../../components/AddEditDeleteButtons";
function removeRoleId(data) {
  if (!data) return [];
  return data.map((item) => {
    const { role_id, ...rest } = item;
    return rest;
  });
}

export default function EmployeeUI({
  initialData = [],
  initialTotalPages = 1,
  initialTotalRecords = 0,
}) {
  const [currentData, setCurrentData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalRecords, setTotalRecords] = useState(initialTotalRecords);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setCurrentData(initialData);
    setTotalPages(initialTotalPages);
    setTotalRecords(initialTotalRecords);
    setCurrentPage(1);
  }, [initialData, initialTotalPages, initialTotalRecords]);

  const limit = 9;
  const formattedData = jsonToTableFormat(
    removeRoleId(currentData),
    currentPage,
    limit
  );

  const getNextPage = async (page) => {
    try {
      const result = await fetchEmployees(page, limit);
      if (result?.metadata?.data) {
        setCurrentData(result.metadata.data);
        setCurrentPage(page);
        setTotalPages(result.metadata.totalPage || 1);
        setTotalRecords(result.metadata.total || 0);
        setErrorMessage("");
      } else {
        setCurrentData([]);
        setTotalPages(1);
        setTotalRecords(0);
        throw new Error("Invalid data structure received from API.");
      }
    } catch (e) {
      setErrorMessage(
        e.message || "Đã xảy ra lỗi không xác định khi tải dữ liệu."
      );
      toast.error("Có lỗi xảy ra khi tải dữ liệu nhân viên. Vui lòng thử lại.");
    }
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(item); // Gọi hàm onEdit với dữ liệu của hàng này
    } else {
      console.warn("onEdit handler is not provided to ActionButtons");
    }
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(item); // Gọi hàm onDelete với dữ liệu của hàng này
    } else {
      console.warn("onDelete handler is not provided to ActionButtons");
    }
  };



  const colums_with_button = [...formattedData.columns, "Actions"];
  

  return (
    <div>
      <Toaster />
      <ReuseTable
        columns={colums_with_button}
        rows={formattedData.rows}
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={getNextPage}
      />
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
}
