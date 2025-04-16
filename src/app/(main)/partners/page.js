"use client";

import React, { useState } from "react";
import { jsonToTableFormat } from "@/lib/utils";
import ReuseTable from "@/components/ReuseTable.jsx";
import CreatePartnerForm from "../../../components/partners/CreatePartner.jsx";

const data = [
  {
    partner_id: 1,
    name: "Công ty TNHH ABC",
    partner_type: "supplier",
    address: "123 Lê Lợi, Quận 1, TP. Hồ Chí Minh",
    phone: "0908111222",
    email: "info@abc.com.vn",
    created_at: "2023-05-10",
  },
  {
    partner_id: 2,
    name: "TNHH Hoa Mai",
    partner_type: "customer",
    address: "45 Nguyễn Huệ, Quận Hoàn Kiếm, Hà Nội",
    phone: "0987654321",
    email: "contact@hoamai.vn",
    created_at: "2023-08-15",
  },
  {
    partner_id: 3,
    name: "Tập đoàn Vạn Tín",
    partner_type: "supplier",
    address: "78 Hai Bà Trưng, Quận 3, TP. Hồ Chí Minh",
    phone: "0369876543",
    email: "support@vantin-group.com",
    created_at: "2024-01-20",
  },
  {
    partner_id: 4,
    name: "Vật tư Xây dựng Hùng Phát",
    partner_type: "supplier",
    address: "210 Điện Biên Phủ, Quận Bình Thạnh, TP. Hồ Chí Minh",
    phone: "0777123456",
    email: null,
    created_at: "2024-03-01",
  },
  {
    partner_id: 5,
    name: "Doanh nghiệp Tư nhân An Khang",
    partner_type: "customer",
    address: "55 Võ Văn Tần, Quận Thanh Khê, Đà Nẵng",
    phone: "0588999000",
    email: "ankhang.dn@email.com",
    created_at: "2024-05-22",
  },
  {
    partner_id: 6,
    name: "Công ty Cổ phần Bình Minh",
    partner_type: "customer",
    address: "99 Phan Xích Long, Quận Phú Nhuận, TP. Hồ Chí Minh",
    phone: "0918273645",
    email: "sales@binhminhcorp.vn",
    created_at: "2023-11-05",
  },
  {
    partner_id: 7,
    name: "Đại lý Phân phối Sài Gòn",
    partner_type: "supplier",
    address: null,
    phone: "0868555444",
    email: "phanphoi.sg@business.vn",
    created_at: "2024-07-18",
  },
  {
    partner_id: 8,
    name: "Siêu thị Mini Mart",
    partner_type: "customer",
    address: "30 Cách Mạng Tháng 8, Quận 10, TP. Hồ Chí Minh",
    phone: "0945112233",
    email: "minimart.cmt8@retail.com",
    created_at: "2024-09-01",
  },
  {
    partner_id: 9,
    name: "Thiết bị An ninh TechGuard",
    partner_type: "supplier",
    address: "Khu Công nghệ cao, TP. Thủ Đức, TP. Hồ Chí Minh",
    phone: "0333444555",
    email: "info@techguard.security",
    created_at: "2023-12-12",
  },
  {
    partner_id: 10,
    name: "Nguyễn Thị Lan (VIP)",
    partner_type: "customer",
    address: "15 Pasteur, Quận Hải Châu, Đà Nẵng",
    phone: "0977888999",
    email: "lan.nguyen.vip@personal.com",
    created_at: "2024-10-25",
  },
  {
    partner_id: 11,
    name: "Đối tác Chiến lược Sun Group",
    partner_type: "supplier",
    address: "Tòa nhà Sun Tower, Trần Hưng Đạo, Hà Nội",
    phone: "0966777888",
    email: null,
    created_at: "2023-06-30",
  },
  {
    partner_id: 12,
    name: "Nhà phân phối Độc quyền Đông Á",
    partner_type: "supplier",
    address: "Lô A5, KCN Sóng Thần, Bình Dương",
    phone: "0922333444",
    email: "contact@donga-distributor.vn",
    created_at: "2024-02-14",
  },
  {
    partner_id: 13,
    name: "Trần Văn Bình (KH)",
    partner_type: "customer",
    address: "111 Hùng Vương, TP. Huế",
    phone: "0399111222",
    email: "binhtran.customer@email.com",
    created_at: "2024-11-11",
  },
  {
    partner_id: 14,
    name: "Công ty Logistics TransViet",
    partner_type: "supplier",
    address: "Cảng Cát Lái, TP. Thủ Đức, TP. Hồ Chí Minh",
    phone: "0888999111",
    email: "operation@transviet.logistics",
    created_at: "2024-08-08",
  },
  {
    partner_id: 15,
    name: "Nhà sản xuất Bao bì Toàn Cầu",
    partner_type: "supplier",
    address: "KCN VSIP 1, Thuận An, Bình Dương",
    phone: "0765432109",
    email: "sales@globalpackaging.com.vn",
    created_at: "2025-01-05",
  },
];

export default function PartnerPage() {
  const [activeTab, setActiveTab] = useState("create");
  const tableData = jsonToTableFormat(data.slice(0, 5));
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
          <div className="overflow-hidden w-full max-h-[70vh]">
            <ReuseTable
              columns={tableData.columns}
              rows={tableData.rows}
              currentPage={1}
              totalPages={200}
              gridTemplateColumns="60px 200px 300px 200px 200px 200px 200px"
            />
          </div>
        )}
      </div>
    </div>
  );
}
