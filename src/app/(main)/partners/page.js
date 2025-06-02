// src/app/(main)/partners/page.js
"use client";

import React, { useState, useEffect, useCallback } from "react";
import TablePartner from "../../../components/partners/TablePartner";
import CreatePartnerForm from "../../../components/partners/CreatePartner";
import { fetchPartner, searchPartners } from "../../../lib/api/partner";
import SearchBar from "../../../components/SearchBar";
import Loading from "../loading";

export default function PartnerPage() {
  const [partnerData, setPartnerData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const limit = 11;

  // 1. Debounce search term để tránh gọi API liên tục
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // 2. Hàm load dữ liệu chính, có thể xử lý cả fetch-all và search
  const loadPartners = useCallback(
    async (page, search) => {
      setIsLoading(true);
      setError(null);
      try {
        let response;

        if (search) {
          response = await searchPartners(search, page, limit);
        } else {
          response = await fetchPartner(limit, page);
        }

        if (response && response.metadata) {
          // ---- PHẦN SỬA LỖI BẮT ĐẦU TỪ ĐÂY ----
          const isSearchResponse = Array.isArray(response.metadata);

          const partners = isSearchResponse
            ? response.metadata
            : response.metadata.data || [];
          const pages = isSearchResponse ? 1 : response.metadata.totalPage || 1;
          const records = isSearchResponse
            ? partners.length
            : response.metadata.total || 0;
          // ---- KẾT THÚC PHẦN SỬA LỖI ----

          const normalizedPartners = partners.map((p) => ({
            partner_id: p.partner_id,
            name: p.name,
            partner_type: p.partner_type,
            phone: p.phone,
            email: p.email,
            address: p.address,
          }));

          setPartnerData(normalizedPartners);
          setTotalPages(pages); // Cập nhật state với biến 'pages'
          setTotalRecords(records); // Cập nhật state với biến 'records'
          setCurrentPage(page);
        } else {
          throw new Error("Failed to fetch partner data or invalid format.");
        }
      } catch (err) {
        setError(err.message || "Could not load partner data.");
        setPartnerData([]);
        setTotalPages(1);
        setTotalRecords(0);
      } finally {
        setIsLoading(false);
      }
    },
    [limit]
  );

  // 3. useEffect để kích hoạt tìm kiếm hoặc tải dữ liệu ban đầu
  useEffect(() => {
    loadPartners(1, debouncedSearchTerm);
  }, [debouncedSearchTerm, loadPartners]);

  // 4. Hàm được gọi khi có hành động (tạo/sửa/xóa) thành công
  const handleActionSuccess = () => {
    loadPartners(currentPage, debouncedSearchTerm);
  };

  // 5. Hàm xử lý khi người dùng thay đổi trang
  const handlePageChange = (newPage) => {
    if (newPage !== currentPage) {
      loadPartners(newPage, debouncedSearchTerm);
    }
  };

  // 6. Hàm xử lý khi gõ vào thanh tìm kiếm
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-x-4 mb-2">
        <h1 className="text-2xl font-semibold text-gray-800 mr-16">
          Partner Management
        </h1>
        <div className="w-full max-w-xs sm:max-w-sm">
          <SearchBar
            value={searchTerm}
            onValueChange={handleSearchChange}
            placeholderText="Partner name"
          />
        </div>
      </div>

      {error && !isLoading && (
        <div className="text-red-500 p-4 bg-red-100 border border-red-400 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row flex-grow gap-4 md:gap-2 md:items-start">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 shadow-md">
          <CreatePartnerForm onSuccess={() => loadPartners(1, "")} />
        </div>
        <div className="flex-grow overflow-hidden flex flex-col">
          {isLoading ? (
            <Loading />
          ) : !error && partnerData.length > 0 ? (
            <TablePartner
              data={partnerData}
              currentPage={currentPage}
              totalPages={totalPages}
              totalRecords={totalRecords}
              onActionSuccess={handleActionSuccess}
              onPageChange={handlePageChange}
            />
          ) : !isLoading && !error && partnerData.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-lg">
              No partners found
              {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
