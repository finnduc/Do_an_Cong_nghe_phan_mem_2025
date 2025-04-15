"use client";

import React, { useState } from "react";
import SimpleTable from "./Table.jsx";
import CreatePartnerForm from "./create_partner.jsx";

export default function PartnerPage() {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 bg-gray-100">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Quản lý Đối Tác
      </h1>
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 justify-center" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("create")}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ease-in-out focus:outline-none ${
              activeTab === "create"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Tạo đối tác
          </button>

          {/* Tab "Quản lý" */}
          <button
            onClick={() => setActiveTab("manage")}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ease-in-out focus:outline-none ${
              activeTab === "manage"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Quản lý
          </button>
        </nav>
      </div>
      <div className="flex-grow mt-1px  flex justify-center md:items-start">
        {activeTab === "create" && <CreatePartnerForm />}
        {activeTab === "manage" && (

          <div className="bg-white rounded-lg shadow overflow-hidden w-full max-h-[70vh]">
            <SimpleTable />
          </div>
        )}
      </div>
    </div>
  );
}
