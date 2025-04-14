"use client";

import React from "react";

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

function SimpleTable() {
  return (
    <div>
      <div className="relative overflow-y-auto border border-gray-300 shadow-md sm:rounded-lg max-h-[70vh]">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 z-10">
            <tr>
              <th scope="col" className="py-3 px-4 border-b text-left">
                ID
              </th>
              <th scope="col" className="py-3 px-4 border-b text-left">
                Tên nhân viên
              </th>
              <th scope="col" className="py-3 px-4 border-b text-left">
                Email
              </th>
              <th scope="col" className="py-3 px-4 border-b text-left">
                Số điện thoại
              </th>
              <th scope="col" className="py-3 px-4 border-b text-left">
                Ngày tạo
              </th>
              <th scope="col" className="py-3 px-4 border-b text-left">
                Tùy chọn
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b text-center">{item.id}</td>
                <td className="py-2 px-4 border-b">{item.name}</td>
                <td className="py-2 px-4 border-b text-left">{item.email}</td>
                <td className="py-2 px-4 border-b text-center">{item.phone}</td>
                <td className="py-2 px-4 border-b text-center">
                  {item.createdAt}
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
