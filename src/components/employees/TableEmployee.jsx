// src/components/employees/TableEmployee.jsx
"use client";
import { useState } from "react";
import ReuseTable from "../ReuseTable";
import { jsonToTableFormat } from "@/lib/utils";
import { deleteEmployees } from "@/lib/api/employee";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { addEditButtons } from "../../components/AddEditDeleteButtons";
import EditEmployeeForm from "./EditEmployeeForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  onPageChange = () => {},
  currentPage = 1,
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);

  const handleDeleteOnRow = (item) => {
    if (!item?.employee_id) {
      toast.error("Không tìm thấy nhân viên để xóa");
      return;
    }

    // Sử dụng toast thay cho window.confirm
    toast.warning(
      `Bạn có chắc chắn muốn xóa nhân viên "${item.name || item.employee_id}"?`,
      {
        position: "top-center",
        action: {
          label: "Xóa",
          onClick: async () => {
            try {
              await deleteEmployees(item.employee_id);
              toast.success("Đã xóa thành công nhân viên");
              onActionSuccess();
            } catch (error) {
              console.error("Error deleting employee:", error);
              toast.error(error.message || "Lỗi khi xóa nhân viên.");
            }
          },
        },
        cancel: {
          label: "Hủy",
        },
      }
    );
  };

  const handleEditClick = (item) => {
    setEmployeeToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEmployeeToEdit(null);
    onActionSuccess();
  };

  const dataProcessed = removeRoleId(initialData);
  const dataWithActionButtons = addEditButtons(
    dataProcessed,
    handleEditClick,
    handleDeleteOnRow
  );

  const limit = 9;
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
        totalPages={initialTotalPages}
        totalRecords={initialTotalRecords}
        onPageChange={onPageChange}
      />
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {employeeToEdit && (
            <EditEmployeeForm
              employeeDataToEdit={employeeToEdit}
              onSuccess={handleEditSuccess}
              onClose={() => {
                setIsEditModalOpen(false);
                setEmployeeToEdit(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
