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

// Component giờ đây nhận thẳng props và không tự quản lý state dữ liệu nữa
export default function TablePartner({
  data = [],
  currentPage = 1,
  totalPages = 1,
  totalRecords = 0,
  onActionSuccess = () => {},
  onPageChange = () => {}, // Nhận hàm xử lý phân trang từ cha
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [partnerToEdit, setPartnerToEdit] = useState(null);

  const limit = 11;

  // Xử lý khi nhấn nút Sửa
  const handleEditClick = (item) => {
    setPartnerToEdit(item);
    setIsEditModalOpen(true);
  };

  // Xử lý khi nhấn nút Xóa
  const handleDeleteOnRow = async (item) => {
    if (!item?.partner_id) {
      toast.error("Không tìm thấy đối tác để xóa");
      return;
    }
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa đối tác "${item.name || item.partner_id}"?`);
    if (confirmed) {
      try {
        await deletePartner(item.partner_id);
        toast.success("Đã xóa thành công đối tác!");
        onActionSuccess();
      } catch (error) {
        console.error("Error deleting partner:", error);
        toast.error(error.message || "Lỗi khi xóa đối tác.");
      }
    }
  };

  // Xử lý khi sửa thành công
  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setPartnerToEdit(null);
    onActionSuccess();
  };
  
  // Thêm các nút Sửa/Xóa vào dữ liệu
  const dataWithActionButtons = addEditButtons(
    data,
    handleEditClick,
    handleDeleteOnRow
  );

  // Format dữ liệu cho ReuseTable
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
        currentPage={currentPage} // Sử dụng prop trực tiếp
        totalPages={totalPages} // Sử dụng prop trực tiếp
        totalRecords={totalRecords} // Sử dụng prop trực tiếp
        onPageChange={onPageChange} // Sử dụng hàm từ prop
      />

      {/* Edit Modal */}
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