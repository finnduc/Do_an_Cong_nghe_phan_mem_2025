"use client";
import React, { useState } from "react";
import TransactionTable from "@/components/export/TransactionTable";

const mockData = [
  {
    header_id: "b59eaaa6-309c-11f0-a79c-005056c00001",
    action: "export",
    total_amount: "34200.00",
    created_at: "2025-05-13T17:00:00.000Z",
    notes: null,
    partner_name: "FPT",
    employee_name: "Bui Thi Hoa",
    items: [
      {
        item_id: "b5a283bf",
        category: "Điện thoại",
        quantity: 10,
        manufacturer: "Apple",
        product_name: "Iphone 15",
        price_per_unit: 1500,
      },
      {
        item_id: "b5a087e2",
        category: "Điện thoại",
        quantity: 12,
        manufacturer: "Apple",
        product_name: "Iphone 16",
        price_per_unit: 1600,
      },
    ],
  },
];

const TestTransactionTable = () => {
  const [page, setPage] = useState(1);

  const columns = [
    "Mã giao dịch",
    "Tổng tiền",
    "Ngày tạo",
    "Ghi chú",
    "Đối tác",
    "Nhân viên",
  ];

  const itemColumns = [
    "Loại",
    "Số lượng",
    "Hãng sản xuất",
    "Tên sản phẩm",
    "Đơn giá",
  ];

  const rows = mockData.map((d) => ({
    data: [
      d.header_id,
      d.total_amount,
      d.notes || "-",
      d.partner_name,
      d.employee_name,
    ],
    items: d.items.map((item) => [
      item.category,
      item.quantity.toString(),
      item.manufacturer,
      item.product_name,
      item.price_per_unit.toString(),
    ]),
  }));

  return (
    <div className="p-6">
      <TransactionTable
        columns={columns}
        itemColumns={itemColumns}
        rows={rows}
        currentPage={page}
        totalPages={1}
        onPageChange={(newPage) => setPage(newPage)}
        totalRecords={mockData.length}
      />
    </div>
  );
};

export default TestTransactionTable;
