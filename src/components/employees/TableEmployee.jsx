// src/components/employees/TableEmployee.jsx
"use client";
import { useState, useEffect } from "react";
import ReuseTable from "../ReuseTable";
import { jsonToTableFormat } from "@/lib/utils";
import {
  fetchEmployees,
  deleteEmployees,
  // updateEmployee không cần gọi trực tiếp ở đây nữa
} from "@/lib/api/employee";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { addEditButtons } from "../../components/AddEditDeleteButtons";
import EditEmployeeForm from "./EditEmployeeForm"; // Import form edit
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Import Dialog components

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
  onActionSuccess = () => {},
}) {
  const [currentData, setCurrentData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalRecords, setTotalRecords] = useState(initialTotalRecords);
  const [errorMessage, setErrorMessage] = useState("");

  // State cho Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

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
        // ... xử lý lỗi
        throw new Error("Invalid data structure received from API.");
      }
    } catch (e) {
      // ... xử lý lỗi
      setErrorMessage(e.message || "Đã xảy ra lỗi không xác định khi tải dữ liệu.");
      toast.error("Có lỗi xảy ra khi tải dữ liệu nhân viên. Vui lòng thử lại.");
    }
  };

  const handleDeleteOnRow = async (item) => {
    if (!item?.employee_id) {
      toast.error("Không tìm thấy nhân viên để xóa");
      return;
    }
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa nhân viên "${item.name || item.employee_id}"?`);
    if (!confirmed) {
      return;
    }
    try {
      await deleteEmployees(item.employee_id);
      toast.success("Đã xóa thành công nhân viên");
      onActionSuccess();
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error(error.message || "Lỗi khi xóa nhân viên.");
    }
  };

  // Hàm được gọi khi click nút Edit trên hàng
  const handleEditClick = (item) => {
    // item ở đây là dữ liệu gốc của hàng (đã được xử lý bởi removeRoleId)
    setEmployeeToEdit(item);
    setIsEditModalOpen(true);
  };

  // Hàm được gọi khi EditEmployeeForm cập nhật thành công
  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEmployeeToEdit(null);
    // Toast đã được gọi trong EditEmployeeForm
    onActionSuccess(); // Gọi callback để EmployeePage tải lại dữ liệu
  };

  const dataProcessed = removeRoleId(currentData);
  const dataWithActionButtons = addEditButtons(
    dataProcessed,
    handleEditClick, // Truyền hàm mới để mở modal
    handleDeleteOnRow
  );

  const formattedTableData = jsonToTableFormat(
    dataWithActionButtons,
    currentPage,
    limit
  );

  return (
    <div>
      <Toaster position="top-right" richColors />
      <ReuseTable
        columns={formattedTableData.columns}
        rows={formattedTableData.rows}
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={getNextPage}
      />
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {employeeToEdit && ( // Chỉ render form nếu có employeeToEdit
            <EditEmployeeForm
              employeeDataToEdit={employeeToEdit}
              onSuccess={handleEditSuccess}
              onClose={() => {
                setIsEditModalOpen(false);
                setEmployeeToEdit(null); // Reset employeeToEdit khi đóng modal
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}