"use client";

import React from "react";

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

function SimpleTable() {
  return (
    <div>
      <div className="relative overflow-y-auto border border-gray-300 shadow-md sm:rounded-lg max-h-[70vh]">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10">
            <tr>
              <th scope="col" className="py-3 px-4 border-b text-center">
                ID
              </th>
              <th scope="col" className="py-3 px-4 border-b text-left">
                Tên đối tác
              </th>
              <th scope="col" className="py-3 px-4 border-b text-left">
                Email
              </th>
              <th scope="col" className="py-3 px-4 border-b text-left">
                Số điện thoại
              </th>
              <th scope="col" className="py-3 px-4 border-b text-left">
                Địa chỉ
              </th>
              <th scope="col" className="py-3 px-4 border-b text-left">
                Vai trò
              </th>
              <th scope="col" className="py-3 px-4 border-b text-left">
                Ngày tạo
              </th>
              <th scope="col" className="py-3 px-4 border-b text-left pl-10">
                Tùy chọn
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.partner_id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-center">
                  {item.partner_id}
                </td>
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className="py-2 px-4 border-b text-left">{item.email}</td>
                <td className="py-2 px-4 border-b text-left">{item.phone}</td>
                <td className="py-2 px-4 border-b text-left">{item.address}</td>
                <td className="py-2 px-4 border-b text-left">
                  {item.partner_type}
                </td>
                <td className="py-2 px-4 border-b text-left">
                  {item.created_at}
                </td>
                <td className="py-2 px-4 border-b text-left whitespace-nowrap">
                  <button className="mr-2 mb-1 md:mb-0 px-3 py-1 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                    Sửa
                  </button>
                  <button className="px-3 py-1 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-black hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SimpleTable;
