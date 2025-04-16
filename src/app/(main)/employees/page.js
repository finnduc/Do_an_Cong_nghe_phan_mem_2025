// employees/page.js
"use client";
import React from "react";
import CreateEmployeeForm from "../../../components/employees/CreateEmployee.jsx";
import { jsonToTableFormat } from "@/lib/utils";
import ReuseTable from "@/components/ReuseTable.jsx";

const data = [
  {
    id: 1,
    name: "Đỗ Quang Hùng",
    email: "hunghq@gmail.com",
    phone: "0869983819",
    createdAt: "15/01/2024",
  },
  {
    id: 2,
    name: "Phạm Việt Giang",
    email: "phamvietgiang@gmail.com",
    phone: "0898645259",
    createdAt: "20/02/2024",
  },
  {
    id: 3,
    name: "Nguyễn Văn Đức",
    email: "nguyenvanduc@gmail.com",
    phone: "0312264587",
    createdAt: "10/03/2024",
  },
  {
    id: 4,
    name: "Đỗ Đức An",
    email: "doducan@gmail.com",
    phone: "0339467262",
    createdAt: "05/04/2024",
  },
  {
    id: 5,
    name: "Lê Minh Tuấn",
    email: "leminhtuan@example.com",
    phone: "0905111222",
    createdAt: "22/05/2024",
  },
  {
    id: 6,
    name: "Trần Thị Lan Anh",
    email: "lananh.tran@example.com",
    phone: "0988333444",
    createdAt: "30/06/2024",
  },
  {
    id: 7,
    name: "Hoàng Văn Hải",
    email: "hai.hoangv@example.com",
    phone: "0367555666",
    createdAt: "14/07/2024",
  },
  {
    id: 8,
    name: "Vũ Ngọc Mai",
    email: "mai.vungoc@example.com",
    phone: "0779777888",
    createdAt: "19/08/2024",
  },
  {
    id: 9,
    name: "Bùi Thanh Sơn",
    email: "son.buithanh@example.com",
    phone: "0834999000",
    createdAt: "25/09/2024",
  },
  {
    id: 10,
    name: "Nguyễn Thị Hoa",
    email: "hoa.nguyen@example.com",
    phone: "0911223344",
    createdAt: "01/11/2024",
  },
  {
    id: 11,
    name: "Lý Văn Dũng",
    email: "dung.lyvan@example.com",
    phone: "0922334455",
    createdAt: "15/12/2024",
  },
  {
    id: 12,
    name: "Đặng Bảo Châu",
    email: "chau.dangbao@example.com",
    phone: "0933445566",
    createdAt: "10/01/2025",
  },
  {
    id: 13,
    name: "Hồ Minh Khang",
    email: "khang.homin@example.com",
    phone: "0944556677",
    createdAt: "05/02/2025",
  },
  {
    id: 14,
    name: "Phan Thu Thảo",
    email: "thao.phanthu@example.com",
    phone: "0955667788",
    createdAt: "20/03/2025",
  },
  {
    id: 15,
    name: "Võ Hoàng Phúc",
    email: "phuc.vohoang@example.com",
    phone: "0966778899",
    createdAt: "01/04/2025",
  },
];

export default function EmployeePage() {
  const tableData = jsonToTableFormat(data.slice(0, 5));
  return (
    <div className="flex flex-col min-h-screen p-4 md:p-6 bg-gray-100">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Quản lý nhân viên
      </h1>
      <div className="flex flex-col md:flex-row flex-grow gap-4 md:gap-2 md:items-start">
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <CreateEmployeeForm />
        </div>
        <div className="flex-grow overflow-hidden">
          <ReuseTable columns={tableData.columns} rows={tableData.rows} currentPage={1} gridTemplateColumns="60px 200px 300px 200px 200px"/>
        </div>

      </div>
    </div>
  );
}