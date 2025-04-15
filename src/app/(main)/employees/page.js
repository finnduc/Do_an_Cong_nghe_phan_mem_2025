// employees/page.js
"use client";
import React from "react";
import CreateEmployeeForm from "./create_employee.jsx";
import SimpleTable from "./Table.jsx";

export default function EmployeePage() {
  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 bg-gray-100">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Quản lý nhân viên
      </h1>
      <div className="flex flex-col md:flex-row flex-grow gap-4 md:gap-2 md:items-start">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <CreateEmployeeForm />
        </div>
        <div className="flex-grow bg-white rounded-lg shadow overflow-hidden">
          <SimpleTable />
        </div>

      </div>
    </div>
  );
}