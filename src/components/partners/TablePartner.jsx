"use client";
import { useState } from "react";
import ReuseTable from "../ReuseTable";
import { jsonToTableFormat } from "@/lib/utils";
import { deletePartner } from "@/lib/api/partner";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { addEditButtons } from "../../components/AddEditDeleteButtons";
import EditPartnerForm from "./EditPartnerForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TablePartner({
  data = [],
  currentPage = 1,
  totalPages = 1,
  totalRecords = 0,
  onActionSuccess = () => {},
  onPageChange = () => {},
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [partnerToEdit, setPartnerToEdit] = useState(null);
  const limit = 11;

  const handleEditClick = (item) => {
    setPartnerToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (item) => {
    if (!item?.partner_id) {
      toast.error("Không tìm thấy đối tác để xóa");
      return;
    }
    toast.warning(
      `Are you sure you want to delete the employee? "${
        item.name || item.partner_id
      }"?`,
      {
        position: "top-center",
        action: {
          label: "Delete",
          onClick: async () => {
            try {
              await deletePartner(item.partner_id);
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

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setPartnerToEdit(null);
    onActionSuccess();
  };

  const dataWithActionButtons = addEditButtons(
    data,
    handleEditClick,
    handleDeleteClick
  );

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
        onPageChange={onPageChange}
      />
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Edit Partner</DialogTitle>
          </DialogHeader>
          {partnerToEdit && (
            <EditPartnerForm
              partnerDataToEdit={partnerToEdit}
              onSuccess={handleEditSuccess}
              onClose={() => setIsEditModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
