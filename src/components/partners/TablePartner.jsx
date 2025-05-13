"use client";
import { useState, useEffect } from "react";
import ReuseTable from "../ReuseTable";
import { jsonToTableFormat } from "@/lib/utils";
import { fetchPartner , updatePartner , deletePartner } from "@/lib/api/partner";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { addEditButtons } from "../../components/AddEditDeleteButtons";
export default function TablePartner({
  initialData = [],
  initialTotalPages = 1,
  initialTotalRecords = 0,
}) {
  const [currentData, setCurrentData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalRecords, setTotalRecords] = useState(initialTotalRecords);
  const [errorMessage, setErrorMessage] = useState("");
  const limit = 11;

  useEffect(() => {
    setCurrentData(initialData);
    setTotalPages(initialTotalPages);
    setTotalRecords(initialTotalRecords);
    setCurrentPage(1);
  }, [initialData, initialTotalPages, initialTotalRecords]);


  const getNextPage = async (page) => {
    try {
      const result = await fetchPartner(limit, page);
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

  const handleDeleteOnRow = async (item ) => {
    if (!item?.partner_id) {
      toast.error("Không tìm thấy nhân viên để xóa" )
      return;
    }
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa nhân viên ?`);
    if (!confirmed) {
      return;
    }
    try {
      await deletePartner(item.partner_id);
      toast.success("Đã xóa thành công nhân viên")
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleEditOnRow = async (item) => {
    if (!item?.partner_id) {
      toast.error("Không tìm thấy nhân viên " )
      return;
    }
    try {
      await updatePartner(item.partner_id)
    } catch (error) {
      
    }
  };
  const processedData = currentData.map(item => {
    const { created_at,  ...rest } = item; 
    return rest; 
  });
                                             // currentData
  const dataWithActionButtons = addEditButtons(processedData, handleEditOnRow, handleDeleteOnRow);
  const formattedData = jsonToTableFormat(dataWithActionButtons, currentPage, limit);



  return (
    <div>
      <Toaster />
      <ReuseTable
        columns={formattedData.columns}
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
