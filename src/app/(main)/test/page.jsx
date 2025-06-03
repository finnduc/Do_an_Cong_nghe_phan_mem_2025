"use client";
import React, { useState } from "react";
import TransactionTable from "@/components/export/ExportTable";

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
        total: 15000,
      },
      {
        item_id: "b5a087e2",
        category: "Điện thoại",
        quantity: 12,
        manufacturer: "Apple",
        product_name: "Iphone 16",
        price_per_unit: 1600,
        total: 19200,
      },
    ],
  },
];

const TestTransactionTable = () => {
  const [page, setPage] = useState(1);

  const columns = [
    "Transaction id",
    "Employee",
    "Partner",
    "Note",
    "Total amount",
    "Created at",
  ];

  const itemColumns = [
    "Product name",
    "Category",
    "Manufacturer",
    "Quantity",
    "Price",
    "Total",
  ];

  const rows = mockData.map((d) => ({
    data: [
      d.header_id,
      d.employee_name,
      d.partner_name,
      d.notes || "-",
      d.total_amount,
      d.created_at,  
    ],
    items: d.items.map((item) => [
      item.product_name,
      item.category,
      item.manufacturer,
      item.quantity.toString(),
      item.price_per_unit.toString(),
      item.total.toString(),
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
