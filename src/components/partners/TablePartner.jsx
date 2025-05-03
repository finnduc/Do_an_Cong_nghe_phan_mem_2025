"use client";
import { useState, useEffect } from "react";
import ReuseTable from "../ReuseTable";
import { jsonToTableFormat } from "@/lib/utils";
import { fetchPartner } from "@/lib/api/partner";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";

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

  // Gọi jsonToTableFormat với dữ liệu hiện tại (currentData)
  // Hàm jsonToTableFormat sẽ tự động thêm cột "No" và format ngày tháng
  const formattedData = jsonToTableFormat(currentData, currentPage, limit);
  console.log("Debugging TablePartner - Before jsonToTableFormat:");
  console.log("Type of currentData:", typeof currentData);
  console.log("Is currentData an Array?", Array.isArray(currentData));
  console.log("Value of currentData:", currentData);
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
