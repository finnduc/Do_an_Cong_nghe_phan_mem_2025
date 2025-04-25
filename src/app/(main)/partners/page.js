"use client";
import React, { useState } from "react";
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
  const [partner , setPartner] = useState([]);
  const [limit,setLimit] = useState(9);
  const [Total_page, setTotal_page] = useState(1);
  const [Records_page , setRecords_page] = useState(1);

  const [loading, setLoading] = useState(true);
  const [err , setErr] = useState(null);



  const columns = ["NO","NAME","PARTNER TYPE","ADDRESS","PHONE","EMAIL","CREATED AT"];
  return (
    <div className="flex flex-col bg-gray-100">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Quản lý nhân viên
      </h1>
      <div className="flex flex-col md:flex-row flex-grow gap-4 md:gap-2 md:items-start">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0 shadow-md">
          <CreatePartnerForm />
        </div>
        <div className="flex-grow overflow-hidden">
          <ReuseTable
            columns={columns}
            rows={[]}
            currentPage={1}
            gridTemplateColumns="60px 200px 300px 200px 200px"
          />
        </div>
      </div>
    </div>
  );
}

