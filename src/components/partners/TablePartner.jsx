"use client";
import { useState, useEffect } from "react";
import ReuseTable from "../ReuseTable";
import { jsonToTableFormat } from "@/lib/utils";
import { fetchPartner, deletePartner } from "@/lib/api/partner"; // Chỉ cần fetchPartner và deletePartner ở đây
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { addEditButtons } from "../../components/AddEditDeleteButtons";
import EditPartnerForm from "./EditPartnerForm"; // Import EditPartnerForm
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  // DialogFooter, // Không cần nếu EditPartnerForm đã có footer riêng
  // DialogClose, // Không cần nếu EditPartnerForm có nút Cancel/Close
} from "@/components/ui/dialog"; // Import Dialog components

export default function TablePartner({
  initialData = [],
  initialTotalPages = 1,
  initialTotalRecords = 0,
  onActionSuccess = () => {}, // Callback này sẽ được gọi sau khi edit/delete thành công
  // Các props liên quan đến phân trang và tìm kiếm có thể được quản lý bởi PartnerPage
  // currentPage: propCurrentPage,
  // onPageChange: propOnPageChange, // Nếu PartnerPage truyền xuống hàm xử lý phân trang
}) {
  const [currentData, setCurrentData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1); // Hoặc initialCurrentPage từ props
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalRecords, setTotalRecords] = useState(initialTotalRecords);
  const [errorMessage, setErrorMessage] = useState("");
  const limit = 11; // Hoặc giá trị limit bạn muốn

  // State cho Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [partnerToEdit, setPartnerToEdit] = useState(null);

  useEffect(() => {
    setCurrentData(initialData);
    setTotalPages(initialTotalPages);
    setTotalRecords(initialTotalRecords);
    setCurrentPage(1); // Reset về trang 1 khi initialData thay đổi
  }, [initialData, initialTotalPages, initialTotalRecords]);

  // Hàm fetch dữ liệu cho phân trang (nếu TablePartner tự quản lý)
  const getNextPage = async (page) => {
    try {
      const result = await fetchPartner(limit, page); // Bỏ searchTerm ở đây nếu PartnerPage quản lý search
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
        e.message || "Đã xảy ra lỗi không xác định khi tải dữ liệu đối tác."
      );
      toast.error("Có lỗi xảy ra khi tải dữ liệu đối tác. Vui lòng thử lại.");
    }
  };

  const handleEditClick = (item) => {
    // item ở đây là dữ liệu gốc của hàng (sau khi map loại bỏ created_at, is_deleted)
    // nhưng trước khi thêm cột "No" và "actions" bởi jsonToTableFormat
    setPartnerToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleDeleteOnRow = async (item) => {
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn xóa đối tác "${item.name || item.partner_id}"?`
    );
    if (!confirmed) {
      return;
    }
    try {
      await deletePartner(item.partner_id);
      toast.success("Đã xóa thành công đối tác!");
      onActionSuccess(); // Gọi callback để PartnerPage có thể tải lại dữ liệu
    } catch (error) {
      console.error("Error deleting partner:", error);
      toast.error(error.message || "Lỗi khi xóa đối tác.");
    }
  };

  // Hàm được gọi khi EditPartnerForm cập nhật thành công
  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setPartnerToEdit(null);
    // Toast đã được gọi trong EditPartnerForm hoặc có thể gọi ở đây nếu muốn
    // toast.success("Cập nhật đối tác thành công!");
    onActionSuccess(); // Gọi callback để PartnerPage có thể tải lại dữ liệu
  };

  // Loại bỏ các trường không cần thiết trước khi truyền vào addEditButtons
  // addEditButtons sẽ nhận vào dữ liệu gốc của các đối tác
  const processedDataForActions = currentData.map((item) => {
    // Giả sử item từ API là đầy đủ, không cần thêm/bớt trường ở đây
    // nếu bạn muốn loại bỏ một số trường trước khi đưa vào form edit,
    // bạn có thể làm ở handleEditClick.
    // Ví dụ, nếu item có 'created_at' mà form không cần:
    const { created_at, is_deleted, ...rest } = item;
    return rest; // Chỉ truyền những trường cần thiết cho addEditButtons và form
  });


  const dataWithActionButtons = addEditButtons(
    processedDataForActions, // Truyền dữ liệu đã được xử lý (chưa qua jsonToTableFormat)
    handleEditClick,
    handleDeleteOnRow
  );

  // jsonToTableFormat sẽ thêm cột "No" và định dạng lại
  const formattedTableData = jsonToTableFormat(
    dataWithActionButtons, // Dữ liệu này đã có cột 'actions'
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
        onPageChange={getNextPage} // Sử dụng getNextPage nội bộ của TablePartner
      />
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-md bg-white"> {/* Thêm class bg-white nếu cần */}
          <DialogHeader>
            <DialogTitle>Edit Partner</DialogTitle>
          </DialogHeader>
          {partnerToEdit && (
            <EditPartnerForm
              partnerDataToEdit={partnerToEdit}
              onSuccess={handleEditSuccess}
              onClose={() => {
                setIsEditModalOpen(false);
                setPartnerToEdit(null); // Reset partnerToEdit khi đóng modal
              }}
            />
          )}
          {/* DialogFooter đã được tích hợp trong EditPartnerForm */}
        </DialogContent>
      </Dialog>
    </div>
  );
}