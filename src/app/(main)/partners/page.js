"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TablePartner from "../../../components/partners/TablePartner";
import CreatePartnerForm from "../../../components/partners/CreatePartner";
import { fetchPartner } from "../../../lib/api/partner";

export default function PartnerPage() {
  const [partnerData, setPartnerData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const limit = 11;
  const router = useRouter();

  const loadPartners = async (page = 1) => {
    if (page === 1) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const response = await fetchPartner(limit, page);
      if (response && response.metadata) {
        if (page === 1) {
          setPartnerData(response.metadata.data || []);
          setTotalPages(response.metadata.totalPage || 1);
          setTotalRecords(response.metadata.total || 0);
        }
      } else {
        throw new Error("Failed to fetch partner data or invalid format.");
      }
    } catch (err) {
      console.error(`Error fetching partners (page ${page}):`, err);
      setError(err.message || "Could not load partner data.");
      setPartnerData([]);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      if (page === 1) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    loadPartners(1);
  }, []);

  const handleCreateSuccess = () => {
    console.log("Partner created successfully, refreshing data...");
    router.refresh();
  };

  return (
    <div className="flex flex-col bg-gray-100">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Partner Management
      </h1>
      {error && !isLoading && (
        <div className="text-red-500 p-4 bg-red-100 border border-red-400 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row flex-grow gap-4 md:gap-2 md:items-start">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 shadow-md">
          <CreatePartnerForm onSuccess={handleCreateSuccess} />
        </div>
        <div className="flex-grow overflow-hidden">
          {isLoading ? (
            <div className="p-4 text-center">Loading partners...</div>
          ) : !error ? (
            <TablePartner
              initialData={partnerData}
              initialTotalPages={totalPages}
              initialTotalRecords={totalRecords}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
