"use client";
import React, { useEffect, useState, useCallback } from "react";
import { jsonToTableFormat } from "@/lib/utils";
import ReuseTable from "../../../components/ReuseTable.jsx";
import CreatePartnerForm from "../../../components/partners/CreatePartner.jsx";
import { fetchPartner } from "../../../lib/api/partner.js";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Ngày không hợp lệ";
  }
};
export default function PartnerPage() {
  // use_state
  const [partner, setPartner] = useState([]);
  const [limit, setLimit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPartner = useCallback(
    async (page) => {
      setIsLoading(true);
      setError(null);
      console.log(`Loading Partner Page ...: ${page}`);
      try {
        const response = await fetchPartner(page, limit);
        console.log("Phản hồi API:", response);
        if (response && response.metadata) {
          setPartner(response.metadata.data || []);
          setTotalPages(response.metadata.totalPage || 1);
          setTotalRecords(response.metadata.total || 0);
        } else {
          console.error("Cấu trúc phản hồi API không đúng:", response);
          setPartner([]);
          setTotalPages(1);
          setTotalRecords(0);
          setError("Không thể phân tích dữ liệu nhân viên.");
        }
      } catch (err) {
        console.error("Lỗi khi tải nhân viên:", err);
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
        setPartner([]);
        setTotalPages(1);
        setTotalRecords(0);
      } finally {
        setIsLoading(false);
      }
    },
    [limit]
  );
  useEffect(() => {
    loadPartner(currentPage);
  }, [currentPage, loadPartner]);

  const columns = [
    "NO",
    "NAME",
    "ADDRESS",
    "PHONE",
    "EMAIL",
    "CREATED AT",
  ];

  const handlePageChange = (newPage) => {
    if (
      !isLoading &&
      newPage >= 1 &&
      newPage <= totalPages &&
      newPage !== currentPage
    ) {
      console.log(`Chuyển đến trang: ${newPage}`);
      setCurrentPage(newPage);
    }
  };
  const rows = partner.map((emp, index) => {
    const sequentialNumber = (currentPage - 1) * limit + index + 1;

    return [
      sequentialNumber,
      emp.name,
      emp.address,
      emp.phone || "N/A",
      emp.email,
      formatDate(emp.created_at),
    ];
  });
  const refreshPartnerList = () => {
    setCurrentPage(1);
    loadPartner(1);
  };
  return (
    <div className="flex flex-col bg-gray-100">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Quản lý nhân viên
      </h1>
      <div className="flex flex-col md:flex-row flex-grow gap-4 md:gap-2 md:items-start">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 shadow-md">
          <CreatePartnerForm  />
        </div>
        <div className="flex-grow overflow-hidden">
          <ReuseTable
            columns={columns}
            rows={rows}
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
