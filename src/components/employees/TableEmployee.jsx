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

  const handleDeleteClick = (item) => {
    if (!item?.employee_id) {
      toast.error("No employee found to delete");
      return;
    }

    toast.warning(
      `Are you sure you want to delete the employee? "${
        item.name || item.employee_id
      }"?`,
      {
        position: "top-center",
        action: {
          label: "Delete",
          onClick: async () => {
            try {
              await deleteEmployees(item.employee_id);
              toast.success("Employee successfully deleted");
              onActionSuccess();
            } catch (error) {
              toast.error("Error while deleting employee");
            }
          },
        },
        cancel: {
          label: "Cancel",
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

  const dataWithActionButtons = addEditButtons(
    initialData,
    handleEditClick,
    handleDeleteClick
  );

  const limit = 9;
  const formattedTableData = jsonToTableFormat(
    dataWithActionButtons,
    currentPage,
    limit
  );

  return (
    <div>
     
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
