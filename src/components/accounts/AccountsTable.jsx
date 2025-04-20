"use client";
import { jsonToTableFormat } from "@/lib/utils";
import ReuseTable from "@/components/ReuseTable";
import { fetchAccounts } from "@/lib/api/accounts";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { useState } from "react";
export default function AccountsTable({ data, totalPages, totalRecords }) {
  const [currentData, setCurrentData] = useState(data);
  const [currentPage, setCurrentPage] = useState(1);
  const formattedData = jsonToTableFormat(currentData, currentPage, 9);
  console.log(totalRecords);
  const getNextPage = async (page) => {
    try {
      const data = await fetchAccounts(page, 9);
      setCurrentData(data?.metadata?.data);
      setCurrentPage(page);
    } catch (e) {
      setErrorMessage(e.message || "Đã xảy ra lỗi không xác định.");
      toast.error(
        "Có lỗi xảy ra khi tạo truy vấn SQL. Vui lòng thử lại hoặc liên hệ với người quản trị."
      );
    }
  };
  return (
    <div className="w-full">
      <Toaster />
      <ReuseTable
        columns={formattedData.columns}
        rows={formattedData.rows}
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={getNextPage}
      />
    </div>
  );
}
