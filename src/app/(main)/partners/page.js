// src/app/(main)/partners/page.js
"use client";

import React, { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation"; // Bỏ nếu không dùng
import TablePartner from "../../../components/partners/TablePartner";
import CreatePartnerForm from "../../../components/partners/CreatePartner";
import { fetchPartner } from "../../../lib/api/partner";
import SearchBar from "../../../components/SearchBar";
import { toast } from "sonner";
// Các import Button, Input, ChevronLeft, ChevronRight không cần nữa nếu không dùng pagination ở đây
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PartnerPage() {
  const [partnerData, setPartnerData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // const [inputPage, setInputPage] = useState(1); // Không cần nếu pagination do ReuseTable quản lý
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const limit = 11; // Hoặc 8 nếu bạn muốn đồng nhất
  // const router = useRouter(); // Bỏ nếu không dùng

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const loadPartners = useCallback(
    async (page = 1, search = debouncedSearchTerm) => {
      if (
        page !== currentPage ||
        (search !== debouncedSearchTerm && search !== "") ||
        (page === 1 && search === "" && !partnerData.length)
      ) {
        setIsLoading(true);
      }
      setError(null);
      try {
        const extraParams = search.trim() !== "" ? { name: search.trim() } : {};
        const response = await fetchPartner(limit, page, extraParams);

        if (response && response.metadata) {
          setPartnerData(response.metadata.data || []);
          setTotalPages(response.metadata.totalPage || 1);
          setTotalRecords(response.metadata.total || 0);
          setCurrentPage(page);
          // setInputPage(page); // Không cần nữa
        } else {
          setPartnerData([]);
          setTotalPages(1);
          setTotalRecords(0);
          setCurrentPage(1);
          // setInputPage(1); // Không cần nữa
          throw new Error("Failed to fetch partner data or invalid format.");
        }
      } catch (err) {
        console.error(
          `Error fetching partners (page ${page}, search '${search}'):`,
          err
        );
        setError(err.message || "Could not load partner data.");
        setPartnerData([]);
        setTotalPages(1);
        setTotalRecords(0);
        setCurrentPage(1);
        // setInputPage(1); // Không cần nữa
      } finally {
        setIsLoading(false);
      }
    },
    [limit, currentPage, debouncedSearchTerm, partnerData.length]
  );

  useEffect(() => {
    loadPartners(1, debouncedSearchTerm);
  }, [debouncedSearchTerm, loadPartners]);

  // useEffect(() => { // Không cần inputPage nữa
  //   setInputPage(currentPage);
  // }, [currentPage]);

  const handleCreateSuccess = () => {
    setSearchTerm("");
  };

  const handlePageChange = (newPage) => {
    // Hàm này sẽ được truyền xuống TablePartner -> ReuseTable
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      loadPartners(newPage, debouncedSearchTerm);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Các hàm handleInputPageChange, handleGoToPage không cần nữa nếu pagination do ReuseTable quản lý
  // const handleInputPageChange = (e) => { ... };
  // const handleGoToPage = () => { ... };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-x-4 mb-1">
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
          <CreatePartnerForm onSuccess={handleCreateSuccess} />
        </div>
        <div className="flex-grow overflow-hidden flex flex-col">
          {isLoading ? (
            <div className="p-4 text-center text-lg">Loading partners...</div>
          ) : !error && partnerData.length > 0 ? (
            <TablePartner
              initialData={partnerData}
              // Truyền các props cho pagination của ReuseTable bên trong TablePartner
              currentPage={currentPage}
              initialTotalPages={totalPages} // ReuseTable có thể cần initialTotalPages và initialTotalRecords
              initialTotalRecords={totalRecords} // để hiển thị thông tin "Showing x of y pages"
              onPageChange={handlePageChange} // Truyền hàm này xuống
            />
          ) : !isLoading && !error && partnerData.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-lg">
              No partners found
              {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}.
            </div>
          ) : null}
          {/* KHỐI JSX PAGINATION ĐÃ BỊ XÓA KHỎI ĐÂY */}
        </div>
      </div>
    </div>
  );
}
