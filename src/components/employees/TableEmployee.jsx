"use client";
import { useState, useEffect } from "react";
import ReuseTable from "../ReuseTable";
import { jsonToTableFormat } from "@/lib/utils";
import {
  fetchEmployees,
  deleteEmployees,
  updateEmployee,
} from "@/lib/api/employee";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { addEditButtons } from "../../components/AddEditDeleteButtons";
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

  const handleDeleteOnRow = async (item , index) => {
    if (!item?.employee_id) {
      toast.error("Không tìm thấy nhân viên để xóa" )
      return;
    }
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa nhân viên ?`);
    if (!confirmed) {
      return;
    }
    try {
      await deleteEmployees(item.employee_id);
      toast.success("Đã xóa thành công nhân viên")
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };


  const handleEditOnRow = async (item) => {
    if (!item?.employee_id) {
      toast.error("Không tìm thấy nhân viên " )
      return;
    }
    try {
      await updateEmployee(item.employee_id)
    } catch (error) {
      
    }
  };
  const dataProcessed = removeRoleId(currentData);
  const dataWithActionButtons = addEditButtons(dataProcessed, handleEditOnRow, handleDeleteOnRow);

  const formattedTableData = jsonToTableFormat(
    dataWithActionButtons, 
    currentPage,
    limit
  );


  return (
    <div>
      <Toaster />
      <ReuseTable
        columns={formattedTableData.columns}
        rows={formattedTableData.rows}
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={getNextPage}
      />
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
    </div>
  );
}
